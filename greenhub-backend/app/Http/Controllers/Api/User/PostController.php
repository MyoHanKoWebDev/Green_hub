<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\React;
use App\Models\SavedPost;
use App\Services\ModerationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function index()
    {
        // Get all active project types
        $types = Post::all();
        return response()->json(['status' => true, 'data' => $types], 200);
    }

    public function show($id)
    {
        $post = Post::withCount(['comments', 'reacts'])
            ->with(['comments.user', 'user'])
            ->find($id);

        if (!$post) return response()->json(['message' => 'Not Data'], 404);

        return response()->json([
            'status' => true,
            'data' => $post
        ], 200);
    }

    public function store(Request $request, ModerationService $moderator)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'member_id' => 'required|exists:users,id',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        if (!$moderator->isClean($request->content)) {
            return response()->json([
                'status' => false,
                'message' => 'Prohibited content detected.'
            ], 403);
        }

        // --- REPOST PREVENTION (Cache for 1 minute) ---
        $cacheKey = 'last_post_' . $request->member_id;
        if (Cache::has($cacheKey) && Cache::get($cacheKey) === md5($request->content)) {
            return response()->json([
                'status' => false,
                'message' => 'You recently posted this content. Please wait a moment.'
            ], 429);
        }

        $imagePaths = [];

        // Start the Transaction
        return DB::transaction(function () use ($request, &$imagePaths, $cacheKey) {
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $name = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('uploads/posts'), $name);
                    $imagePaths[] = $name;
                }
            }

            $post = Post::create([
                'content' => $request->content,
                'image' => $imagePaths, // Saved as JSON array
                'post_date' => now(),
                'member_id' => $request->member_id,
            ]);

            Cache::put($cacheKey, md5($request->content), now()->addMinutes(1));

            return response()->json(['status' => true, 'message' => 'Green Product added!', 'data' => $post], 201);
        });
    }

    public function update(Request $request, $id, ModerationService $moderator)
    {
        $post = Post::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'content' => 'sometimes|required|string',
            'member_id' => 'sometimes|required|exists:users,id',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        if ($request->has('content') && !$moderator->isClean($request->content)) {
            return response()->json([
                'status' => false,
                'message' => 'Updated content contains prohibited words.'
            ], 403);
        }

        return DB::transaction(function () use ($request, $post) {
            if ($request->hasFile('images')) {
                // Delete old images from folder
                if ($post->image) {
                    foreach ($post->image as $oldImage) {
                        $filePath = public_path('uploads/posts/' . $oldImage);

                        // check if the file exists before unlinking
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                    }
                }

                $imagePaths = [];
                foreach ($request->file('images') as $file) {
                    $name = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('uploads/posts'), $name);
                    $imagePaths[] = $name;
                }
                $post->image = $imagePaths;
            }

            $post->content = $request->content ?? $post->content;
            $post->save();

            return response()->json(['status' => true, 'message' => 'Product Updated successfully!', 'data' => $post], 200);
        });
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        if (!$post) return response()->json(['message' => 'Not found'], 404);
        if ($post->image) {
            foreach ($post->image as $img) {
                $filePath = public_path('uploads/posts/' . $img);

                // check if the file exists before unlinking
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
        }
        $post->delete();
        return response()->json(['status' => true, 'message' => 'Post deleted'], 200);
    }

    public function toggleReact(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'post_id' => 'required|exists:knowledge_posts,id',
            'member_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {
            $data = [
                'post_id' => $request->post_id,
                'member_id' => $request->member_id
            ];

            $existing = React::where($data)->first();

            if ($existing) {
                $existing->delete();
                return response()->json(['status' => true, 'action' => 'unliked']);
            }

            React::create(array_merge($data, ['react_date' => now()]));
            return response()->json(['status' => true, 'action' => 'liked']);
        });
    }

    public function toggleSave(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'post_id' => 'required|exists:knowledge_posts,id',
            'member_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {
            $data = [
                'post_id' => $request->post_id,
                'member_id' => $request->member_id
            ];

            $saved = SavedPost::where($data)->first();

            if ($saved) {
                $saved->delete();
                return response()->json(['status' => true, 'message' => 'Unsaved']);
            }

            SavedPost::create(array_merge($data, ['savedDate' => now()]));
            return response()->json(['status' => true, 'message' => 'Saved']);
        });
    }
}

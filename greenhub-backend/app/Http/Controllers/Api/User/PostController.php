<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use App\Models\React;
use App\Models\SavedPost;
use App\Models\User;
use App\Services\ModerationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function index(Request $request)
    {
        // The ID of the person browsing (to check is_reacted/is_saved)
        $viewerId = $request->query('member_id');

        // The ID of the profile owner (to filter the list to just one person's posts)
        $profileId = $request->query('profile_id');

        $posts = Post::with(['user'])
            ->withCount(['reacts', 'comments'])
            // Filter by profile owner if profile_id is provided
            ->when($profileId, function ($query) use ($profileId) {
                $query->where('member_id', $profileId);
            })
            // Check if the current viewer has interacted with these posts
            ->when($viewerId, function ($query) use ($viewerId) {
                $query->withExists(['reacts as is_reacted' => function ($q) use ($viewerId) {
                    $q->where('member_id', $viewerId);
                }])
                    ->withExists(['savedPosts as is_saved' => function ($q) use ($viewerId) {
                        $q->where('member_id', $viewerId);
                    }]);
            })
            ->latest()
            ->get();

        return response()->json(['status' => true, 'data' => $posts]);
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
            'images' => 'nullable|array|max:4',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120'
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

            $post->load('user')->loadCount(['comments', 'reacts']);

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
            $existingImages = json_decode($request->input('existing_images', '[]'), true);
            $newImagePaths = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $name = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('uploads/posts'), $name);
                    $newImagePaths[] = $name;
                }
            }

            $post->content = $request->content ?? $post->content;
            $post->image = array_merge($existingImages, $newImagePaths);
            $post->save();

            // Use a fresh query to load everything including the interaction booleans
            $currentMemberId = $request->member_id;

            $updatedPost = Post::with(['user'])
                ->withCount(['comments', 'reacts'])
                ->when($currentMemberId, function ($query) use ($currentMemberId) {
                    $query->withExists(['reacts as is_reacted' => function ($q) use ($currentMemberId) {
                        $q->where('member_id', $currentMemberId);
                    }])
                        ->withExists(['savedPosts as is_saved' => function ($q) use ($currentMemberId) {
                            $q->where('member_id', $currentMemberId);
                        }]);
                })
                ->find($post->id);

            return response()->json([
                'status' => true,
                'message' => 'Post Updated successfully!',
                'data' => $updatedPost
            ], 200);
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
            return response()->json([
                'status' => false,
                'message' => 'Missing User ID',
                'errors' => $validator->errors()
            ], 422);
        }
        try {
            $data = [
                'post_id' => $request->post_id,
                'member_id' => $request->member_id
            ];

            // Ensure you are using the correct Model name here
            $existing = React::where($data)->first();

            if ($existing) {
                $existing->delete();
                $action = 'unliked';
            } else {
                React::create(array_merge(['react_date' => now()], $data));
                $action = 'liked';
            }

            $count = React::where('post_id', $request->post_id)->count();

            return response()->json([
                'status' => true,
                'action' => $action,
                'reacts_count' => $count
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage() // This will tell you exactly why it's crashing
            ], 500);
        }
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

    public function getGreenHeroes()
    {
        // We get users, and count the reacts on their posts
        $heroes = User::withCount(['reactsReceived as reacts_count'])
            ->orderBy('reacts_count', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $heroes
        ]);
    }
}

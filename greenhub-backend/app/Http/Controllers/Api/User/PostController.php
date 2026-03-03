<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function index()
    {
        // Get all active project types
        $types = Post::all();
        return response()->json(['status' => true, 'data' => $types]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'member_id' => 'required|exists:users,id',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $imagePaths = [];

        // Start the Transaction
        return DB::transaction(function () use ($request, &$imagePaths) {
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

            return response()->json(['status' => true, 'message' => 'Green Product added!', 'data' => $post], 201);
        });
    }

    public function update(Request $request, $id)
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
        return response()->json(['status' => true, 'message' => 'Post deleted']);
    }
}

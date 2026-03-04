<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'comTtext'  => 'required|string',
            'post_id'   => 'required|exists:knowledge_posts,id',
            'member_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {
            $comment = Comment::create([
                'comTtext'  => $request->comTtext,
                'comDate'   => now(),
                'post_id'   => $request->post_id,
                'member_id' => $request->member_id,
            ]);

            // Load the user who commented so the frontend can show their name/profile image
            return response()->json([
                'status' => true,
                'data' => $comment->load('user')
            ], 201);
        });
    }

    public function destroy($id)
    {
        $comment = Comment::find($id);
        if (!$comment) return response()->json(['message' => 'Not found'], 404);

        $comment->delete();

        return response()->json(['status' => true, 'message' => 'Comment deleted'], 200);
    }
}

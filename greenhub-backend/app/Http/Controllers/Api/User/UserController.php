<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show($id)
    {
        // We add a constraint to 'memberProjects' count
        // to only count links to projects that aren't deleted
        $user = User::withCount([
            'posts',
            'memberProjects' => function ($query) {
                $query->whereHas('ecoProject', function ($q) {
                    $q->whereNull('deleted_at');
                });
            }
        ])->findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'proImg' => $user->proImg,
                'created_at' => $user->joinDate,
                'totalPosts' => $user->posts_count,
                'totalProjects' => $user->member_projects_count, // This is now "Active Only"
            ]
        ]);
    }

    public function getSavedPosts(Request $request)
{
    $viewerId = $request->query('viewer_id');

    $posts = Post::with(['user'])
        ->withCount(['reacts', 'comments'])
        ->whereHas('savedPosts', function ($query) use ($viewerId) {
            $query->where('member_id', $viewerId);
        })
        // THIS PART IS ESSENTIAL FOR COLORS:
        ->withExists(['reacts as is_reacted' => function ($q) use ($viewerId) {
            $q->where('member_id', $viewerId);
        }])
        ->withExists(['savedPosts as is_saved' => function ($q) use ($viewerId) {
            $q->where('member_id', $viewerId);
        }])
        ->latest()
        ->get();

    return response()->json(['status' => true, 'data' => $posts]);
}
}
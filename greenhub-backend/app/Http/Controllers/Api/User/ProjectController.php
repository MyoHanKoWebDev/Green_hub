<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\EcoProject;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function getMemberProjects(Request $request)
    {
        $profileId = $request->query('profile_id');

        $projects = EcoProject::with(['projectType', 'memberProjects.user'])
            ->where('role', 'member')
            // If profile_id is provided, filter projects by that user
            ->when($profileId, function ($query) use ($profileId) {
                $query->whereHas('memberProjects', function ($q) use ($profileId) {
                    $q->where('member_id', $profileId);
                });
            })
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'status' => true,
            'data' => $projects
        ]);
    }
}
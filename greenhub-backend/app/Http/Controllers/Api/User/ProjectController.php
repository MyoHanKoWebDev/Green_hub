<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\EcoProject;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function getMemberProjects()
    {
        // Simply filter by the role column
        $projects = EcoProject::where('role', 'member')->get();

        return response()->json([
            'status' => true,
            'data' => $projects
        ]);
    }
}

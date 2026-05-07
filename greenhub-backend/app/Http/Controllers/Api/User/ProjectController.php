<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\EcoProject;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function getMemberProjects()
{
    // Eager load memberProjects and the user associated with each one
    $projects = EcoProject::with(['projectType', 'memberProjects.user'])
                ->where('role', 'member')
                ->orderBy('id', 'desc')
                ->get();

    return response()->json([
        'status' => true,
        'data' => $projects
    ]);
}
}
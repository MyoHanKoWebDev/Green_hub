<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\EcoProject;
use App\Models\MemberProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EcoProjectController extends Controller
{
    public function getAdminProjects()
    {
        // Simply filter by the role column
        $projects = EcoProject::where('role', 'admin')->orderBy('id', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $projects
        ]);
    }
    public function storeAdmin(Request $request)
    {
        return $this->processStore($request, true);
    }

    public function storeMember(Request $request)
    {
        return $this->processStore($request, false);
    }

    private function processStore(Request $request, $isAdmin)
    {
        $validator = Validator::make($request->all(), [
            'title'           => 'required|string|max:255',
            'description'     => 'required|string',
            'video' => [
                'required',
                'file', // Ensures it is actually an uploaded file
                'mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,application/octet-stream', // Checks the content type
                'max:51200', // 50MB limit
            ],
            'project_type_id' => 'required|exists:project_types,id',
            'member_id'       => $isAdmin ? 'nullable' : 'required|exists:users,id',
        ]);

        set_time_limit(300);

        // if ($request->hasFile('video')) {
        //     return response()->json([
        //         'mime' => $request->file('video')->getMimeType(),
        //         'extension' => $request->file('video')->getClientOriginalExtension(),
        //         'size_in_bytes' => $request->file('video')->getSize(),
        //     ]);
        // }

        if ($validator->fails()) return response()->json(['status' => false, 'errors' => $validator->errors()], 422);

        $role = $isAdmin ? 'admin' : 'member';

        return DB::transaction(function () use ($request, $role, $isAdmin) {

            $videoName = null;

            if ($request->hasFile('video')) {
                $videoFile = $request->file('video');

                // Use getClientOriginalExtension() instead of trusting the server's guess
                $extension = $videoFile->getClientOriginalExtension();
                $videoName = time() . '_' . uniqid() . '.' . $extension;

                $videoFile->move(public_path('uploads/videos'), $videoName);
            }

            $project = EcoProject::create([
                'title'           => $request->title,
                'description'     => $request->description,
                'video'           => $videoName,
                'project_type_id' => $request->project_type_id,
                'role'            => $role, // Automatically saved as 'admin' or 'member'
            ]);

            // If it's a member, link it to the MemberProject table
            if (!$isAdmin) {
                MemberProject::create([
                    'project_id' => $project->id,
                    'member_id'  => $request->member_id,
                    'sharedDate' => now()
                ]);
            }

            return response()->json([
                'status' => true,
                'message' => "Project Created successfully as $role",
                'data' => $project
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $project = EcoProject::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'           => 'sometimes|required|string|max:255',
            'description'     => 'sometimes|required|string',
            'video' => [
                'sometimes',
                'required',
                'file', // Ensures it is actually an uploaded file
                'mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,application/octet-stream', // Checks the content type
                'max:51200', // 50MB limit
            ],
            'project_type_id' => 'sometimes|required|exists:project_types,id',
        ]);
        set_time_limit(300);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $project) {

            if ($request->hasFile('video')) {
                // Delete the old video file if it exists in the folder
                if ($project->video) {
                    $oldPath = public_path('uploads/videos/' . $project->video);
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }
                }

                $videoFile = $request->file('video');
                $videoName = time() . '_' . $videoFile->getClientOriginalName();
                $videoFile->move(public_path('uploads/videos'), $videoName);

                $project->video = $videoName;
            }

            // Update other text fields
            $project->fill($request->only(['title', 'description', 'project_type_id']));

            $project->save();

            return response()->json([
                'status' => true,
                'message' => 'Project updated successfully!',
                'data' => $project
            ], 200);
        });
    }

    public function destroy($id)
    {
        $project = EcoProject::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json([
            'status' => true,
            'message' => 'Move to trash'
        ], 200);
    }
}

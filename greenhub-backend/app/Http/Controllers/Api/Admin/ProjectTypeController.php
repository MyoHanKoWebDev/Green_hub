<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProjectTypeController extends Controller
{
    public function index()
    {
        // Get all active project types
        $types = ProjectType::all();
        return response()->json(['status' => true, 'data' => $types]);
    }

    public function store(Request $request)
    {
        $cleanName = mb_convert_case(trim($request->typeName), MB_CASE_TITLE, "UTF-8");
        $request->merge(['typeName' => $cleanName]);

        $validator = Validator::make($request->all(), [
            'typeName' => 'required|string|unique:project_types,typeName,NULL,id,deleted_at,NULL',
            'shareDate' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $type = ProjectType::create([
            'typeName' => $cleanName,
            'shareDate' => $request->shareDate ?? now()
        ]);

        return response()->json(['status' => true, 'message' => 'Project type added!', 'data' => $type], 201);
    }

    public function update(Request $request, $id)
    {
        $type = ProjectType::find($id);
        if (!$type) return response()->json(['message' => 'Not found'], 404);

        $cleanName = mb_convert_case(trim($request->typeName), MB_CASE_TITLE, "UTF-8");
        $request->merge(['typeName' => $cleanName]);

        $validator = Validator::make($request->all(), [
            'typeName' => [
                'sometimes',
                'required',
                'string',
                Rule::unique('project_types')->ignore($id)->whereNull('deleted_at'),
            ]
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        $type->update($request->only('typeName', 'shareDate'));
        return response()->json(['status' => true, 'message' => 'Project Type Updated successfully']);
    }

    public function destroy($id)
    {
        $type = ProjectType::withCount('ecoProjects')->find($id);
        if (!$type) return response()->json(['message' => 'Not found'], 404);

        if ($type->eco_projects_count > 0) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot delete. This type is being used by active projects!'
            ], 400);
        }

        $type->delete(); // Soft delete
        return response()->json(['status' => true, 'message' => 'Moved to trash']);
    }
}

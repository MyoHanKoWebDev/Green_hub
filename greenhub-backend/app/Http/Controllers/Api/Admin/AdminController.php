<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as RulesPassword;
use PDO;

class AdminController extends Controller
{

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'adEmail' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        // Find admin by adEmail
        $admin = Admin::where('adEmail', $request->adEmail)->first();

        // Check password
        if (!$admin ) {
            return response()->json([
                'status' => false,
                'message' => 'The provided credential email does not match our records.'
            ], 404);
        }

         if (!Hash::check($request->password, $admin->adPassword)) {
            return response()->json([
                'status' => false,
                'message' => 'The password you entered is incorrect.'
            ], 401); // 401 Unauthorized
        }

        // Create Token (Sanctum)
        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login successful',
            'admin' => $admin,
            'token' => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['status' => true, 'message' => 'Logged out']);
    }

    public function update(Request $request, $id)
    {
        $admin = Admin::find($id);
        if (!$admin) return response()->json(['message' => 'Admin not found'], 404);

        $validator = Validator::make($request->all(), [
            'adName'  => 'sometimes|required|string|max:255',
            'adEmail' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('admins')->ignore($id),
            ],
            'adImage' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }
        // 3. Execution via Transaction
        return DB::transaction(function () use ($request, $admin) {
            // Handle Image Replacement
            if ($request->hasFile('adImage')) {
                // Delete old image if it exists in public/uploads/admin
                if ($admin->adImage && file_exists(public_path('uploads/admin/' . $admin->adImage))) {
                    unlink(public_path('uploads/admin/' . $admin->adImage));
                }

                // Store new image
                $imageName = time() . '_admin_' . $request->file('adImage')->getClientOriginalName();
                $request->file('adImage')->move(public_path('uploads/admin'), $imageName);

                $admin->adImage = $imageName;
            }

            // Update other fields using your migration attributes
            $admin->adName  = $request->input('adName', $admin->adName);
            $admin->adEmail = $request->input('adEmail', $admin->adEmail);

            $admin->save();

            return response()->json([
                'status' => true,
                'message' => 'Admin profile updated successfully',
                'data' => $admin
            ], 200);
        });
    }

    public function changePassword(Request $request, $id)
    {
        // 1. Find the Admin
        $admin = Admin::find($id);

        if (!$admin) {
            return response()->json([
                'status' => false,
                'message' => 'Admin account not found'
            ], 404);
        }

        if (!Hash::check($request->current_password,$admin->adPassword)) {
            return response()->json([
                'status' => false,
                'message' => 'The current password you entered is incorrect.'
            ], 401);
        }

        // 2. Validate the Request
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => [
                'required',
                'confirmed',
                RulesPassword::min(8)->letters()->numbers()->mixedCase(),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // 3. Verify Current Password
        // We use Hash::check to compare the plain text input with the Bcrypt hash in DB


        // 4. Update and Hash the New Password
        $admin->adPassword = Hash::make($request->new_password);
        $admin->save();

        return response()->json([
            'status' => true,
            'message' => 'Password has been updated successfully.'
        ], 200);
    }
}

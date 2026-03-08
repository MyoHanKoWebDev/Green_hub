<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Mail\OtpMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    //Custom Deterministic Non-Cryptographic Hash Function.
    private function myCustomHasher($password)
    {
        $salt = 'Green$Hub_#_2026!'; // A secret string added to every password
        $peppered = $password . $salt;
        $hash = "";

        // Convert characters to a custom numeric string
        foreach (str_split($peppered) as $char) {
            // Get ASCII value, multiply by a prime number, and convert to hex
            $transformed = dechex((ord($char) * 31) % 255);
            $hash .= str_pad($transformed, 2, "0", STR_PAD_LEFT);
        }

        // Return a reversed version to make it even more "custom"
        return strrev($hash);
    }
    public function register(Request $request)
    {
        // 1. Define Validation Rules
        $rules = [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Za-z\s]+$/'
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users'
            ],
            'address' => ['required', 'string', 'max:500'],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/',
                'confirmed'
            ],
            'proImg' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ]
        ];

        // 2. Define Custom Error Messages
        $messages = [
            'name.regex' => 'The name can only contain letters and spaces (no numbers or symbols).',
            'email.unique' => 'This email is already registered with Greenhub.',
            'address.required' => 'Please provide a delivery address for your green products.',
            'password.regex' => 'Your password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'password.min' => 'For your security, the password must be at least 8 characters long.',
            'proImg.required' => 'Please upload a profile picture to complete your registration.',
        ];

        // 3. Run Validator
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $imageName = null;
        if ($request->hasFile('proImg')) {
            $imageName = time() . '_' . $request->file('proImg')->getClientOriginalName();

            // Move to public/uploads/profiles inside your Laravel project
            $request->file('proImg')->move(
                public_path('uploads/profiles'),
                $imageName
            );
        }

        $hashedPassword = $this->myCustomHasher($request->password);
        // Create User
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'address' => $request->address,
            'password' => $hashedPassword,
            'proImg' => $imageName,
            'joinDate' => now()
        ]);

        // Create Token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Welcome to Greenhub! Your account was created successfully.',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function updateProfile(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // 1. Validation (Email and Password usually handled in separate functions)
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'max:255', 'regex:/^[A-Za-z\s]+$/'],
            'address' => ['string', 'max:500'],
            'proImg' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048']
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $user) {
            // 2. Update Basic Info
            $user->name = $request->input('name', $user->name);
            $user->address = $request->input('address', $user->address);

            // 3. Handle Image Update
            if ($request->hasFile('proImg')) {
                // Delete Old Image if it exists
                if ($user->proImg && file_exists(public_path('uploads/profiles/' . $user->proImg))) {
                    unlink(public_path('uploads/profiles/' . $user->proImg));
                }

                // Upload New Image
                $imageName = time() . '_' . $request->file('proImg')->getClientOriginalName();
                $request->file('proImg')->move(public_path('uploads/profiles'), $imageName);
                $user->proImg = $imageName;
            }

            $user->fill($request->only(['name', 'address']));

            $user->save();

            return response()->json([
                'status' => true,
                'message' => 'Profile updated successfully!',
                'user' => $user
            ]);
        });
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean' // Add this to validation
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'This email is not registered in our Greenhub records.'
            ], 404); // 404 Not Found
        }

        $inputHash = $this->myCustomHasher($request->password);
        // 2. Email exists, now check if the password is correct
        // if (!Hash::check($request->password, $user->password)) {
        //     return response()->json([
        //         'status' => false,
        //         'message' => 'The password you entered is incorrect.'
        //     ], 401); // 401 Unauthorized
        // }

        if ($inputHash != $user->password) {
            return response()->json([
                'status' => false,
                'message' => 'The password you entered is incorrect.'
            ], 401); // 401 Unauthorized
        }
        // Logic for "Remember Me"
        // If remember is true, we set expiration to 1 year, otherwise 2 hours
        $expiresAt = $request->remember ? now()->addYear() : now()->addHours(2);

        $token = $user->createToken('auth_token', ['*'], $expiresAt)->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Your account was logged in successfully.',
            'token' => $token,
            'user' => $user
        ], 200);
    } 

    public function changePassword(Request $request, $id)
    {
        // 1. Define Validation Rules
        $rules = [
            'current_password' => [
                'required',
                'string'
            ],
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/',
                'confirmed' // This looks for 'new_password_confirmation'
            ]
        ];

        // 2. Define Custom Error Messages
        $messages = [
            'new_password.min' => 'For your security, the new password must be at least 8 characters long.',
            'new_password.regex' => 'Your new password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'new_password.confirmed' => 'The new password confirmation does not match.',
        ];

        // 3. Run Validator
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        $user = User::findOrFail($id);

        // 2. Verify Current Password using your custom hasher
        // We hash the input and compare it to what is in the DB
        if ($this->myCustomHasher($request->current_password) !== $user->password) {
            return response()->json([
                'status' => false,
                'message' => 'The current password you entered is incorrect.'
            ], 401);
        }

        // 3. Update to New Password
        $user->password = $this->myCustomHasher($request->new_password);
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Password updated successfully! Please log in again if required.'
        ]);
    }

    //googlelogin function
    public function googleLogin(Request $request)
    {
        $token = $request->token;

        // Verify token with Google
        $response = Http::get("https://www.googleapis.com/oauth2/v3/userinfo?access_token=$token");

        if ($response->failed()) {
            return response()->json(['status' => false, 'message' => 'Invalid Google Token'], 401);
        }

        $googleUser = $response->json();

        $user = User::where('email', $googleUser['email'])->first();

        if (!$user) {
            // Create new user if they don't exist
            $user = User::create([
                'email' => $googleUser['email'],
                'name' => $googleUser['name'],
                'address' => null,
                'proImg' => $googleUser['picture'],
                // Use your CUSTOM hashing function here to be consistent!
                'password' => $this->myCustomHasher(Str::random(24)),
                'joinDate' => now(),
            ]);
        } else {
            // If they exist, only update the profile image or name (keep password same)
            $user->update([
                'name' => $googleUser['name'],
                'proImg' => $googleUser['picture'],
            ]);
        }

        $authToken = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'token' => $authToken,
            'user' => $user
        ]);
    }

    // Send OTP to User Email
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();
        $otp = rand(100000, 999999);

        // Update user record with hashed OTP and expiry
        $user->update([
            'otp_code' => Hash::make($otp),
            'otp_expires_at' => now()->addMinutes(10)
        ]);

        // Send the email
        Mail::to($user->email)->send(new OtpMail($otp));

        return response()->json(['status' => true, 'message' => 'OTP sent successfully!']);
    }

    //  Verify if OTP is correct
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|digits:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user->otp_code || !Hash::check($request->otp, $user->otp_code)) {
            return response()->json(['status' => false, 'message' => 'Invalid OTP code.'], 401);
        }

        if (now()->gt($user->otp_expires_at)) {
            return response()->json(['status' => false, 'message' => 'OTP has expired.'], 401);
        }

        return response()->json(['status' => true, 'message' => 'OTP verified successfully.']);
    }

    // Update to New Password
    public function resetPassword(Request $request)
    {

        $rules = [
            'email' => [
                'required',
                'email',
                'exists:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).+$/',
                'confirmed'
            ]
        ];

        // 2. Define Custom Error Messages
        $messages = [
            'password.regex' => 'Your password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'password.min' => 'For your security, the password must be at least 8 characters long.',
        ];

        // 3. Run Validator
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        // Check if OTP was actually verified (optional security step)
        if (!$user->otp_code) {
            return response()->json(['status' => false, 'message' => 'Unauthorized password reset.'], 403);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'otp_code' => null, // Clear OTP after success
            'otp_expires_at' => null
        ]);

        return response()->json(['status' => true, 'message' => 'Password reset successfully.']);
    }
}

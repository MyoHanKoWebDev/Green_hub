<?php

use App\Http\Controllers\Api\Admin\EcoProjectController;
use App\Http\Controllers\Api\Admin\GreenProductController;
use App\Http\Controllers\Api\User\AuthController;
use App\Http\Controllers\Api\Admin\PaymentController;
use App\Http\Controllers\Api\Admin\ProjectTypeController;
use App\Http\Controllers\Api\User\CommentController;
use App\Http\Controllers\Api\User\OrderController;
use App\Http\Controllers\Api\User\PostController;
use App\Http\Controllers\Api\User\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use PhpParser\Comment;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('user')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        // --- PUBLIC ROUTES (No Token Needed) ---
        Route::post('/register', 'register');
        Route::post('/login', 'login');
        Route::post('/send-otp', 'sendOtp');
        Route::post('/verify-otp', 'verifyOtp');
        Route::post('/reset-password', 'resetPassword');
        Route::post('/google-login', 'googleLogin');

        // --- PROTECTED ROUTES (Token Required & Validated) ---
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/verify-session', function (Request $request) {
                return response()->json([
                    'status' => true,
                    'user' => $request->user()
                ]);
            });
            Route::put('/update-profile/{id}', 'updateProfile');
            Route::put('/change-password/{id}', 'changePassword');
        });
    });
    Route::controller(ProjectController::class)->prefix('projects')->group(function () {
        Route::get('/', 'getMemberProjects');
    });

    Route::controller(PostController::class)->prefix('posts')->group(function () {
        Route::get('/', 'index');
        Route::get('/{id}', 'show');
        Route::post('/', 'store');
        Route::post('/toggleReact', 'toggleReact');
        Route::post('/toggleSave', 'toggleSave');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    Route::controller(CommentController::class)->prefix('comments')->group(function () {
        Route::post('/', 'store');
        Route::delete('/{id}', 'destroy');
    });

    Route::controller(OrderController::class)->prefix('orders')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'checkout');
        Route::post('/{id}/confirm', [OrderController::class, 'confirmOrder']);
        Route::post('/{id}/reject', [OrderController::class, 'rejectOrder']);
    });
});

Route::prefix('admin')->group(function () {
    // --- Payment Management ---
    Route::controller(PaymentController::class)->prefix('payments')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    // --- Project Type Management ---
    Route::controller(ProjectTypeController::class)->prefix('types')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    // --- Product Management ---
    Route::controller(GreenProductController::class)->prefix('products')->group(function () {
        Route::get('/', 'index');
        Route::get('/{id}', 'show');
        Route::post('/', 'store');
        Route::post('/rating', 'giveRating');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    Route::controller(EcoProjectController::class)->prefix('projects')->group(function () {
        Route::get('/', 'getAdminProjects');
        Route::post('/storeAdmin', 'storeAdmin');
        Route::post('/storeMember', 'storeMember');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });
});


Route::get('/check-limits', function () {
    return response()->json([
        'upload_max' => ini_get('upload_max_filesize'),
        'post_max' => ini_get('post_max_size'),
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

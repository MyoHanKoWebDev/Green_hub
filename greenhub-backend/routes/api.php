<?php

use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\EcoProjectController;
use App\Http\Controllers\Api\Admin\GreenProductController;
use App\Http\Controllers\Api\User\AuthController;
use App\Http\Controllers\Api\Admin\PaymentController;
use App\Http\Controllers\Api\Admin\ProjectTypeController;
use App\Http\Controllers\api\admin\ReportController;
use App\Http\Controllers\Api\User\CommentController;
use App\Http\Controllers\Api\User\ContactController;
use App\Http\Controllers\Api\User\OrderController;
use App\Http\Controllers\Api\User\PostController;
use App\Http\Controllers\Api\User\ProjectController;
use App\Http\Controllers\Api\User\UserController;
use App\Models\Contact;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use PhpParser\Comment;
use Barryvdh\DomPDF\Facade\Pdf;

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

Route::get('/orders/voucher/{id}', function ($id) {
    $purchase = Purchase::with(['purchaseDetails.greenProduct', 'user'])->findOrFail($id);

    // We will create this view next
    $pdf = Pdf::loadView('pdf.voucher', compact('purchase'));

    return $pdf->download("GreenHub_Voucher_#{$id}.pdf");
});

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
            Route::post('/update-profile/{id}', 'updateProfile');
            Route::put('/change-password/{id}', 'changePassword');
        });
    });
    Route::controller(ProjectController::class)->prefix('projects')->group(function () {
        Route::get('/', 'getMemberProjects');
    });

    Route::controller(PostController::class)->prefix('posts')->group(function () {
        Route::get('/', 'index');
        Route::get('/green-heroes', 'getGreenHeroes');
        Route::get('/{id}', 'show');
        Route::post('/', 'store');
        Route::post('/toggleReact', 'toggleReact');
        Route::post('/toggleSave', 'toggleSave');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    Route::controller(CommentController::class)->prefix('comments')->group(function () {
        Route::get('/{postId}', 'index');
        Route::post('/', 'store');
        Route::delete('/{id}', 'destroy');
    });

    Route::controller(UserController::class)->prefix('userProfile')->group(function () {
        Route::get('/savedPosts', 'getSavedPosts');
        Route::get('/{userId}', 'show');
    });

    Route::controller(OrderController::class)->prefix('orders')->group(function () {
        Route::get('/', 'index');
        Route::get('/{userId}', 'getUserOrders');
        Route::post('/', 'checkout');
        Route::post('/{id}/confirm', [OrderController::class, 'confirmOrder']);
        Route::post('/{id}/reject', [OrderController::class, 'rejectOrder']);
    });

    Route::controller(ContactController::class)->prefix('contact')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
    });
});

Route::prefix('admin')->group(function () {
    Route::controller(ReportController::class)->prefix('reports')->group(function () {
        Route::get('/', 'index');
        Route::get('/sales', 'getSalesChart');
        Route::get('/top-project-types' , 'getTopProjectTypes');
    });
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

    Route::controller(AdminController::class)->prefix('profile')->group(function () {
        Route::put('/{id}', 'update');
        Route::post('/login', 'login');
        Route::put('/change-password/{id}', 'changePassword');
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
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Credenziali non valide'], 401);
    }

    /** @var \App\Models\User $user **/
    $user = Auth::user();
    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user,
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logout effettuato']);
});

Route::middleware('auth:sanctum')->prefix('customers')->group(function () {
    Route::get('/', [\App\Http\Controllers\CustomerController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\CustomerController::class, 'store']);
    Route::get('/{customer}', [\App\Http\Controllers\CustomerController::class, 'show']);
    Route::put('/{customer}', [\App\Http\Controllers\CustomerController::class, 'update']);
    Route::delete('/{customer}', [\App\Http\Controllers\CustomerController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('products')->group(function () {
    Route::get('/', [\App\Http\Controllers\ProductController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\ProductController::class, 'store']);
    Route::get('/{product}', [\App\Http\Controllers\ProductController::class, 'show']);
    Route::put('/{product}', [\App\Http\Controllers\ProductController::class, 'update']);
    Route::delete('/{product}', [\App\Http\Controllers\ProductController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('orders')->group(function () {
    Route::get('/', [\App\Http\Controllers\OrderController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\OrderController::class, 'store']);
    Route::get('/{order}', [\App\Http\Controllers\OrderController::class, 'show']);
    Route::put('/{order}', [\App\Http\Controllers\OrderController::class, 'update']);
    Route::delete('/{order}', [\App\Http\Controllers\OrderController::class, 'destroy']);
});
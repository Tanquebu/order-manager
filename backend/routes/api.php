<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;



Route::post('/login', function (Request $request) {
    Log::info('Richiesta login ricevuta', $request->all());
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Credenziali non valide'], 401);
    }

    return response()->json([
        'message' => 'Login effettuato',
        'user' => Auth::user(),
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    Auth::logout();
    return response()->json(['message' => 'Logout effettuato']);
});
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TournamentController;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::get('auth/get-email', [AuthController::class, 'getEmailByUsername']);
Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('tournament/status', [TournamentController::class, 'status']);
    Route::post('tournament/register', [TournamentController::class, 'register']);
    Route::get('tournament/candidates', [TournamentController::class, 'candidates']);
});

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'username'     => 'required|alpha_num|min:6|max:15|unique:users,username',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|min:8|max:16',
            'phone_number' => 'required|numeric|digits_between:11,13',
        ]);

        $user = User::create([
            'name'         => $request->name,
            'username'     => $request->username,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'phone_number' => $request->phone_number,
        ]);

        return response()->json([
            'message' => 'Register berhasil',
            'user'    => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|alpha_num|min:6|max:15',
            'password' => 'required|min:8|max:16',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Username atau password salah',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $team = \App\Models\Team::where('user_id', $user->id)->first();

        return response()->json([
            'message'    => 'Login berhasil',
            'token'      => $token,
            'registered' => $team ? true : false,
            'user'       => [
                'id'           => $user->id,
                'name'         => $user->name,
                'username'     => $user->username,
                'email'        => $user->email,
                'phone_number' => $user->phone_number,
            ],
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email tidak ditemukan',
            ], 404);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        DB::table('password_reset_tokens')->insert([
            'email'      => $request->email,
            'token'      => hash('sha256', $token),
            'created_at' => now(),
        ]);

        $resetUrl = env('FRONTEND_URL', 'http://localhost:5173')
                    . '/reset-password?token='
                    . $token
                    . '&email='
                    . urlencode($request->email);

        return response()->json([
            'message'   => 'Link reset password berhasil dibuat.',
            'reset_url' => $resetUrl,
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token'    => 'required|string',
            'email'    => 'required|email',
            'password' => 'required|min:8|max:16',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record || !hash_equals($record->token, hash('sha256', $request->token))) {
            return response()->json([
                'message' => 'Token tidak valid atau sudah kadaluarsa.',
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Password berhasil direset.',
        ], 200);
    }

    public function getEmailByUsername(Request $request)
    {
        $request->validate(['username' => 'required|string']);

        $user = User::where('username', $request->username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User tidak ditemukan',
                'email'   => null,
            ], 404);
        }

        $parts = explode('@', $user->email);
        $maskedName = substr($parts[0], 0, 3) . str_repeat('*', max(strlen($parts[0]) - 3, 3));
        $maskedEmail = $maskedName . '@' . $parts[1];

        return response()->json([
            'message'      => 'Email ditemukan',
            'email'        => $user->email,
            'masked_email' => $maskedEmail,
        ], 200);
    }
}

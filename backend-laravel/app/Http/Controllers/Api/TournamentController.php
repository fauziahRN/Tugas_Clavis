<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class TournamentController extends Controller
{
    public function status(Request $request)
    {
        $team = Team::where('user_id', $request->user()->id)->first();

        return response()->json([
            'registered' => $team ? true : false,
            'team'       => $team,
        ], 200);
    }

    public function register(Request $request)
    {
        $request->validate([
            'team_name'      => 'required|alpha_dash|min:4|max:15|unique:teams,team_name',
            'captain_name'   => ['required', 'regex:/^[a-zA-Z\s]+$/'],
            'captain_phone'  => 'required|numeric|digits_between:7,14',
            'captain_gender' => 'required|in:Pria,Wanita',
            'member_name'    => ['required', 'regex:/^[a-zA-Z\s]+$/'],
            'member_phone'   => 'required|numeric|digits_between:7,14',
            'member_gender'  => 'required|in:Pria,Wanita',
        ]);

        $userId = $request->user()->id;

        if (Team::where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Anda sudah terdaftar'], 409);
        }

        $team = Team::create([
            'team_name'      => $request->team_name,
            'captain_name'   => $request->captain_name,
            'captain_phone'  => $request->captain_phone,
            'captain_gender' => $request->captain_gender,
            'member_name'    => $request->member_name,
            'member_phone'   => $request->member_phone,
            'member_gender'  => $request->member_gender,
            'user_id'        => $userId,
        ]);

        $user         = $request->user();
        $captainEmail = $user->email;
        $captainName  = $request->captain_name;
        $teamName     = $request->team_name;

        try {
            $htmlBody = <<<HTML
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F6AF5; font-size: 24px;">🏆 Tournament Registration</h1>
    </div>
    <div style="background: #F0FDF4; border: 1px solid #22C55E; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
        <div style="font-size: 48px;">✅</div>
        <h2 style="color: #166534; font-size: 22px; margin: 12px 0 8px;">Pendaftaran Berhasil!</h2>
        <p style="color: #166534; font-size: 14px;">Tim Anda telah berhasil terdaftar untuk turnamen ini.</p>
    </div>
    <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="color: #111827; font-size: 16px; margin-bottom: 16px; border-bottom: 1px solid #E5E7EB; padding-bottom: 8px;">📋 Detail Pendaftaran Tim</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 40%;">Nama Tim</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">$teamName</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Kapten Tim</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">$captainName</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Email Kapten</td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">$captainEmail</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Status</td>
                <td style="padding: 8px 0;">
                    <span style="background: #DCFCE7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Terdaftar ✓</span>
                </td>
            </tr>
        </table>
    </div>
    <div style="background: #EFF6FF; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #1E40AF; font-size: 15px; margin-bottom: 10px;">📅 Informasi Jadwal</h3>
        <p style="color: #1E40AF; font-size: 13px; line-height: 1.6; margin: 0;">
            Jadwal pertandingan akan segera diumumkan.<br>
            Pastikan Anda memantau email ini untuk informasi lebih lanjut.<br>
            Harap hadir tepat waktu saat pertandingan berlangsung.
        </p>
    </div>
    <div style="background: #FEF3C7; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #92400E; font-size: 13px; margin: 0;">
            ⚠️ <strong>Penting:</strong> Simpan email ini sebagai bukti pendaftaran Anda.
            Tunjukkan email ini jika diperlukan saat hari pertandingan.
        </p>
    </div>
    <div style="text-align: center; border-top: 1px solid #E5E7EB; padding-top: 20px;">
        <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
            Email ini dikirim otomatis oleh sistem.<br>
            Tournament Registration App © 2026
        </p>
    </div>
</div>
HTML;

            Mail::send([], [], function ($message) use ($captainEmail, $captainName, $teamName, $htmlBody) {
                $message->to($captainEmail, $captainName)
                    ->subject('Pendaftaran Turnamen Berhasil - ' . $teamName)
                    ->html($htmlBody);
            });

            Log::info('Confirmation email sent to: ' . $captainEmail);
        } catch (\Exception $e) {
            Log::error('Email failed: ' . $e->getMessage());
        }

        return response()->json([
            'registered' => true,
            'team'       => $team,
        ], 200);
    }

    public function candidates(Request $request)
    {
        $teams = Team::all();

        return response()->json([
            'message' => 'Data kandidat',
            'data'    => $teams,
        ], 200);
    }
}

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

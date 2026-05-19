<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $table = 'teams';

    protected $fillable = [
        'team_name',
        'captain_name',
        'captain_phone',
        'captain_gender',
        'member_name',
        'member_phone',
        'member_gender',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'sharedDate',
        'project_id',
        'member_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ecoProject()
    {
        return $this->belongsTo(EcoProject::class, 'project_id');
    }
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'proImg',
        'joinDate',
        'otp_code',
        'otp_expires_at'
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'join_date' => 'datetime',
    ];

    // Posts
    public function posts()
    {
        return $this->hasMany(Post::class,'member_id');
    }

    // Comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Reacts
    public function reacts()
    {
        return $this->hasMany(React::class);
    }

    // Saved Posts
    public function savedPosts()
    {
        return $this->hasMany(SavedPost::class);
    }

    // Member Projects
    public function memberProjects()
    {
        return $this->hasMany(MemberProject::class, 'member_id');
    }

    // Ratings
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'member_id');
    }

    // Purchases
    public function purchases()
    {
        return $this->hasMany(Purchase::class, 'member_id');
    }

    public function reactsReceived()
    {
        // This connects Users to Reacts through their Posts
        return $this->hasManyThrough(React::class, Post::class, 'member_id', 'post_id');
    }
}
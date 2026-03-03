<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'knowledge_posts';
    protected $fillable = [
        'content',
        'image',
        'post_date',
        'member_id'
    ];

    protected $casts = [
        'image' => 'array',
        'post_date' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'member_id');
    }

    public function reacts()
    {
        return $this->hasMany(React::class, 'member_id');
    }

    public function savedPosts()
    {
        return $this->hasMany(SavedPost::class);
    }
}

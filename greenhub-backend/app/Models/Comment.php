<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['comTtext', 'comDate', 'post_id', 'member_id'];

    protected $casts = [
        'comDate' => 'datetime'
    ];
     public function user()
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedPost extends Model
{
    use HasFactory;

    protected $fillable = ['savedDate', 'post_id', 'member_id'];

     public function user()
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
}

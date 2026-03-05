<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = ['rating', 'ratedDate', 'product_id', 'member_id'];

     public function user()
    {
        return $this->belongsTo(User::class , 'member_id');
    }

    public function greenProduct()
    {
        return $this->belongsTo(GreenProduct::class, 'product_id');
    }
}

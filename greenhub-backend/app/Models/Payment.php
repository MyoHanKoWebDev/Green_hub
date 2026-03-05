<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory , SoftDeletes;

    protected $fillable = ['method' , 'is_active','payImg'];

    protected $dates = ['deleted_at'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}

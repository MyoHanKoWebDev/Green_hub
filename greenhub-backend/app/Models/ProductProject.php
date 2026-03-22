<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'sharedDate',
        'project_id',
        'product_id',
    ];

    public function greenProduct()
    {
        return $this->belongsTo(GreenProduct::class, 'product_id');
    }

    public function ecoProject()
    {
        return $this->belongsTo(EcoProject::class, 'project_id');
    }

}
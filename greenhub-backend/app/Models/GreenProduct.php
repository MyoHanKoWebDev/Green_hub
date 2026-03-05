<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GreenProduct extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'productName',
        'description',
        'price',
        'image',
        'stock_qty',
    ];

    protected $casts = [
        'ratings_avg_rating' => 'float',
    ];
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'product_id');
    }

    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetail::class, 'product_id');
    }

    public function productProjects()
    {
        return $this->hasMany(ProductProject::class, 'product_id');
    }
}

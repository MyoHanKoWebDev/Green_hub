<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantity',
        'product_id',
        'purchase_id'
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function greenProduct()
    {
        return $this->belongsTo(GreenProduct::class, 'product_id');
    }
}

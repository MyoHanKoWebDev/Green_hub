<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'purchaseDate',
        'member_id',
        'shipping_address'
    ];

     public function user()
    {
        return $this->belongsTo(User::class, 'member_id');
    }

    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetail::class, 'purchase_id');
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'purchase_id');
    }
}

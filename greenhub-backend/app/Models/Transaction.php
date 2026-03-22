<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'tran_no',
        'payment_proof_img',
        'tranDate',
        'payment_id',
        'purchase_id'
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

}

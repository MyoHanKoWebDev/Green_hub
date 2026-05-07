<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Mail\OrderConfirmed;
use App\Mail\OrderRejected;
use App\Models\GreenProduct;
use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::with(['user', 'transaction.payment', 'purchaseDetails.greenProduct']);

        // Filter by Status (pending, confirmed, rejected)
        $query->when($request->status && $request->status !== 'all', function ($q) use ($request) {
            return $q->where('status', $request->status);
        });

        // Search by User Name
        $query->when($request->search, function ($q) use ($request) {
            return $q->whereHas('user', function ($userQuery) use ($request) {
                $userQuery->where('name', 'like', '%' . $request->search . '%');
            });
        });

        $orders = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $orders
        ], 200);
    }

    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:green_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'phone_number' => 'required|string',
            'payment_id' => 'required|string',
            'transaction_no' => 'required|string|unique:transactions,tran_no',
            'payment_proof_img' => 'nullable|image|max:5120'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {
            // 1. Create the Purchase (The Order)
            $purchase = Purchase::create([
                'status' => 'pending',
                'purchaseDate' => now(),
                'member_id' => $request->member_id,
                'shipping_address' => $request->shipping_address,
                'phone_number' => $request->phone_number,
            ]);

            // Handle Payment Proof Image Upload
            $payImgName = null;
            if ($request->hasFile('payment_proof_img')) {
                $payImgName = time() . '_' . $request->file('payment_proof_img')->getClientOriginalName();
                $request->file('payment_proof_img')->move(public_path('uploads/payments'), $payImgName);
            }

            // Create or Find the Payment Method
            // We use firstOrCreate so we don't have 100 "KPay" rows
            // $payment = Payment::firstOrCreate(
            //     ['method' => $request->payment_method],
            //     ['payImg' => $payImgName]
            // );

            // Create the Transaction Record (The Proof)
            $transaction = Transaction::create([
                'tran_no' => $request->transaction_no,
                'payment_proof_img' => $payImgName,
                'tranDate' => now(),
                'payment_id' => $request->payment_id,
                'purchase_id' => $purchase->id,
            ]);

            // 5. Save Items and Deduct Stock
            foreach ($request->items as $item) {
                $product = GreenProduct::find($item['product_id']);

                if ($product->stock_qty < $item['quantity']) {
                    throw new \Exception("Stock insufficient for {$product->productName}");
                }

                PurchaseDetail::create([
                    'quantity' => $item['quantity'],
                    'product_id' => $item['product_id'],
                    'purchase_id' => $purchase->id,
                ]);

                $product->decrement('stock_qty', $item['quantity']);
            }

            return response()->json([
                'status' => true,
                'message' => 'Order placed! Waiting for admin confirmation.',
                'transaction_id' => $transaction->tran_no
            ], 201);
        });
    }

    public function confirmOrder($id)
    {
        return DB::transaction(function () use ($id) {
            // Load the user relationship so we have the email address
            $purchase = Purchase::with(['purchaseDetails.greenProduct', 'user'])->findOrFail($id);

            if ($purchase->status !== 'pending') {
                return response()->json(['message' => 'Order is already processed'], 400);
            }

            // foreach ($purchase->purchaseDetails as $detail) {
            //     $product = $detail->greenProduct;
            //     if ($product->stock_qty < $detail->quantity) {
            //         return response()->json([
            //             'status' => false,
            //             'message' => "Confirmation failed. {$product->productName} is now out of stock."
            //         ], 422);
            //     }
            //     $product->decrement('stock_qty', $detail->quantity);
            // }

            $purchase->update(['status' => 'confirmed']);

            // Send Confirmation Email with Voucher Link
            Mail::to($purchase->user->email)->send(new OrderConfirmed($purchase));

            return response()->json(['status' => true, 'message' => 'Order confirmed and email sent!']);
        });
    }

   public function rejectOrder($id)
{
    return DB::transaction(function () use ($id) {
        $purchase = Purchase::with(['purchaseDetails.greenProduct', 'user'])->findOrFail($id);

        // Only allow rejection if the order is currently 'pending'
        if ($purchase->status !== 'pending') {
            return response()->json(['status' => false, 'message' => 'Order cannot be rejected'], 400);
        }

        // REVERT THE STOCK: Add the quantities back to the products
        foreach ($purchase->purchaseDetails as $detail) {
            $product = $detail->greenProduct;
            $product->increment('stock_qty', $detail->quantity);
        }

        $purchase->update(['status' => 'rejected']);

        // Send Rejection Email
        Mail::to($purchase->user->email)->send(new OrderRejected($purchase));

        return response()->json(['status' => true, 'message' => 'Order rejected and stock restored.']);
    });
}
}

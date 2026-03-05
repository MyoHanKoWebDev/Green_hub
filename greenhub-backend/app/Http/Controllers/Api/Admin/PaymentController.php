<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    // GET: List all payment methods
    public function index()
    {
        $payments = Payment::where('is_active', true)->get();
        return response()->json(['status' => true, 'data' => $payments], 200);
    }

    // POST: Create a new payment method
    public function store(Request $request)
    {
        $cleanMethod = strtoupper(trim($request->method));

        //Merge the cleaned data back into the request so the 'unique' check works
        $request->merge(['method' => $cleanMethod]);

        $validator = Validator::make($request->all(), [
            'method' => 'required|string|unique:payments,method',
            'payImg'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $cleanMethod) {
            // 1. Handle Image
            $imageName = null;
            if ($request->hasFile('payImg')) {
                $imageName = time() . '_' . $request->file('payImg')->getClientOriginalName();
                $request->file('payImg')->move(public_path('uploads/admin'), $imageName);
            }

            $payment = Payment::create([
                'method' => $cleanMethod,
                'is_active' => true,
                'payImg' => $imageName
            ]);

            return response()->json(['status' => true, 'message' => 'Payment method added!', 'data' => $payment], 201);
        });
    }

    // PUT: Update an existing method
    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) return response()->json(['message' => 'Not found'], 404);

        // 1. Clean the input
        if ($request->has('method')) {
            $request->merge(['method' => strtoupper(trim($request->method))]);
        }

        // 2. Validation
        $validator = Validator::make($request->all(), [
            'method' => 'sometimes|required|string|unique:payments,method,' . $id,
            'payImg' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $payment) {
            // Handle Image Replacement
            if ($request->hasFile('payImg')) {
                if ($payment->payImg && file_exists(public_path('uploads/admin/' . $payment->payImg))) {
                    unlink(public_path('uploads/admin/' . $payment->payImg));
                }
                $imageName = time() . '_' . $request->file('payImg')->getClientOriginalName();
                $request->file('payImg')->move(public_path('uploads/admin'), $imageName);
                $payment->payImg = $imageName;
            }

            // Update other fields
            $payment->method = $request->input('method', $payment->method);
            if ($request->has('is_active')) {
                $payment->is_active = $request->is_active;
            }

            $payment->save();

            return response()->json(['status' => true, 'message' => 'Payment Method Updated successfully'], 200);
        });
    }

    //making disable function on active
    public function toggleStatus($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->is_active = !$payment->is_active; // Flips true to false, or false to true
        $payment->save();

        return response()->json([
            'status' => true,
            'message' => 'Status updated!',
            'current_status' => $payment->is_active
        ]);
    }

    // DELETE: Remove a method
    public function destroy($id)
    {
        $payment = Payment::withCount('transactions')->find($id);

        if (!$payment) return response()->json(['message' => 'Not found'], 404);

        // Check if the payment has been used in any transactions
        if ($payment->transactions_count > 0) {
            return response()->json([
                'status' => false,
                'message' => 'Cannot delete! This method has history. Please deactivate it instead.'
            ], 400);
        }

        $payment->delete();
        return response()->json(['status' => true, 'message' => 'Moved to trash'], 200);
    }

    // Restore a deleted payment
    // public function restore($id)
    // {
    //     $payment = Payment::withTrashed()->find($id);
    //     if ($payment) {
    //         $payment->restore();
    //         return response()->json(['message' => 'Payment method restored!']);
    //     }
    // }

    // See EVERYTHING including deleted ones
    // public function indexWithDeleted()
    // {
    //     $payments = Payment::withTrashed()->get();
    //     return response()->json($payments);
    // }
}

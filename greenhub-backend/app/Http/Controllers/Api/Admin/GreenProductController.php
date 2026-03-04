<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\EcoProject;
use App\Models\GreenProduct;
use App\Models\ProductProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GreenProductController extends Controller
{
    public function index()
    {
        // We only show products that have at least 1 in stock
        $products = GreenProduct::where('stock_qty', '>', 0)->get();
        return response()->json(['status' => true, 'data' => $products]);
    }

    public function show($id)
    {
        // We only show products that have at least 1 in stock
        $products = GreenProduct::where('id', $id)->get();
        return response()->json(['status' => true, 'data' => $products]);
    }

    // public function store(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'productName' => 'required|string|max:255',
    //         'description' => 'required|string',
    //         'price'       => 'required|numeric',
    //         'image'       => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
    //         'stock_qty'   => 'required|integer'
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
    //     }

    //     $imageName = null;
    //     if ($request->hasFile('image')) {
    //         // Stores in storage/app/public/products
    //         $imageName = time() . '_' . $request->file('image')->getClientOriginalName();

    //         // Move to public/uploads/profiles inside your Laravel project
    //         $request->file('image')->move(
    //             public_path('uploads/admin'),
    //             $imageName
    //         );
    //     }

    //     $product = GreenProduct::create([
    //         'productName' => $request->productName,
    //         'description' => $request->description,
    //         'price'       => $request->price,
    //         'image'       => $imageName,
    //         'stock_qty'   => $request->stock_qty,
    //     ]);

    //     return response()->json(['status' => true, 'message' => 'Green Product added!', 'data' => $product], 201);
    // }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'productName' => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric',
            'stock_qty'   => 'required|integer',
            'image'       => 'nullable|image|max:2048',
            'project_id'  => 'required|integer|exists:eco_projects,id'
        ]);


        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request) {
            // 1. Handle Image
            $imageName = null;
            if ($request->hasFile('image')) {
                $imageName = time() . '_' . $request->file('image')->getClientOriginalName();
                $request->file('image')->move(public_path('uploads/admin'), $imageName);
            }

            // 2. Create the Green Product
            $product = GreenProduct::create([
                'productName' => $request->productName,
                'description' => $request->description,
                'price'       => $request->price,
                'image'       => $imageName,
                'stock_qty'   => $request->stock_qty
            ]);

            // 3. Link to the Project in product_projects table
            ProductProject::create([
                'sharedDate' => now(),
                'project_id' => $request->project_id,
                'product_id' => $product->id
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Green Product added!',
                'data' => $product->load('productProjects') // Shows the link in response
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $product = GreenProduct::find($id);
        if (!$product) return response()->json(['message' => 'Not found'], 404);

        $validator = Validator::make($request->all(), [
            'productName' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price'       => 'sometimes|required|numeric',
            'image'       => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'stock_qty'   => 'sometimes|required|integer',
            'project_id' =>  'sometimes|exists:eco_projects,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        return DB::transaction(function () use ($request, $product) {
            // 1. Handle Image
            if ($request->hasFile('image')) {
                if ($product->image) {
                    $oldPath = public_path('uploads/admin/' . $product->image);
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                    }
                }
                $imageName = time() . '_' . $request->file('image')->getClientOriginalName();
                $request->file('image')->move(public_path('uploads/admin'), $imageName);

                // IMPORTANT: Manually update the attribute in the model instance
                $product->image = $imageName;
            }

            //Fill other data
            $product->fill($request->only(['productName', 'description', 'price', 'stock_qty']));

            //SAVE EVERYTHING AT ONCE (This is the most reliable way)
            $product->save();

            //Handle Project Link
            if ($request->has('project_id')) {
                ProductProject::updateOrCreate(
                    ['product_id' => $product->id],
                    ['project_id' => $request->project_id, 'sharedDate' => now()]
                );
            }

            $product->refresh();

            return response()->json([
                'status' => true,
                'message' => 'Product Updated successfully!',
                'data' => $product->load('productProjects') // This shows the linked project too!
            ], 200);
        });
    }

    public function destroy($id)
    {
        $product = GreenProduct::find($id);
        if (!$product) return response()->json(['message' => 'Not found'], 404);

        // if ($product->image) {
        //     $oldPath = public_path('uploads/admin/' . $product->image);
        //     if (file_exists($oldPath)) {
        //         unlink($oldPath);
        //     }
        // }
        // Security: Don't delete if there are purchase details (history)
        // if ($product->purchaseDetails()->exists()) {
        //     return response()->json(['message' => 'Product has history, cannot delete. Set stock to 0 instead.'], 400);
        // }

        $product->delete();
        return response()->json(['status' => true, 'message' => 'Moved to trash'], 200);
    }
}
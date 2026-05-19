<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\EcoProject;
use App\Models\GreenProduct;
use App\Models\ProductProject;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GreenProductController extends Controller
{
    public function index(Request $request)
    {
        // 1. Clean up inputs (Use null if empty string to avoid query errors)
        $search = $request->filled('search') ? $request->query('search') : null;
        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');
        $projectTypeId = $request->query('project_type_id'); // This comes from React

        // Use one variable for sort logic
        $sort = $request->query('sort', 'newest');
        $perPage = $request->query('per_page', 6);

        $query = GreenProduct::where('stock_qty', '>=', 0)
            ->with(['ecoProjects.projectType'])
            ->withCount('ratings')
            ->withAvg('ratings', 'rating');

        // 2. Apply Filters
        $query->when($search, function ($q, $search) {
            return $q->where(function ($sub) use ($search) {
                $sub->where('productName', 'LIKE', "%{$search}%");
            });
        })

            ->when($request->filled('min_price'), function ($query) use ($minPrice) {
                // Cast to float to match the decimal precision in DB
                return $query->where('price', '>=', (float)$minPrice);
            })
            ->when($request->filled('max_price'), function ($query) use ($maxPrice) {
                return $query->where('price', '<=', (float)$maxPrice);
            })
            ->when($projectTypeId, function ($q) use ($projectTypeId) {
                return $q->whereHas('ecoProjects', function ($sub) use ($projectTypeId) {
                    // Because EcoProject has 'project_type_id', we filter it here
                    $sub->where('project_type_id', (array)$projectTypeId);
                });
            });

        // 3. Optimized Sorting Logic (Fixed the 500 error)
        if ($sort === 'popular') {
            // Must match the naming convention of withAvg
            $query->orderBy('ratings_avg_rating', 'desc');
        } else {
            // Default to newest
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate($request->query('per_page', 6));

        return response()->json([
            'status' => true,
            'data' => $products->items(),
            'pagination' => [
                'total' => $products->total(),
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'last_page' => $products->lastPage(),
            ]
        ]);
    }

    public function show($id)
{
    // 1. Load the product with its projects and their types
    $product = GreenProduct::with([
        'ecoProjects' => function ($q) {
            $q->select('eco_projects.id', 'title', 'description', 'video', 'project_type_id');
        },
    ])
        ->withCount('ratings')
        ->withAvg('ratings', 'rating')
        ->findOrFail($id);

    // 2. Get the Type ID of the first associated project
    // We reach into the first project and grab its project_type_id
    $projectTypeId = $product->ecoProjects->first()?->project_type_id;

    $recommendations = [];
    if ($projectTypeId) {
        // 3. Find other products that have projects of the same Type
        $recommendations = GreenProduct::where('id', '!=', $id) // Exclude current product
            ->whereHas('ecoProjects', function ($query) use ($projectTypeId) {
                // Filter projects belonging to the same type
                $query->where('project_type_id', $projectTypeId);
            })
            ->with(['ecoProjects' => function ($query) {
                $query->select('eco_projects.id', 'title', 'project_type_id');
            }])
            ->where('stock_qty', '>=', 0) // Usually want items actually in stock
            ->withAvg('ratings', 'rating')
            ->limit(4)
            ->get();
    }

    return response()->json([
        'status' => true,
        'data' => $product,
        'recommendations' => $recommendations
    ]);
}

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'productName' => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|numeric',
            'stock_qty'   => 'required|integer',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
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

        //Security: Don't delete if there are purchase details (history)
        if ($product->purchaseDetails()->exists()) {
            return response()->json(['message' => 'Product has history, cannot delete. Set stock to 0 instead.'], 400);
        }

        if ($product->image) {
            $oldPath = public_path('uploads/admin/' . $product->image);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

        $product->delete();
        return response()->json(['status' => true, 'message' => 'Moved to trash'], 200);
    }

    public function giveRating(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'product_id' => 'required|exists:green_products,id',
            'member_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'errors' => $validator->errors()], 422);
        }

        // Use updateOrCreate if you want them to be able to change their rating later
        Rating::updateOrCreate(
            ['product_id' => $request->product_id, 'member_id' => $request->member_id],
            ['rating' => $request->rating, 'ratedDate' => now()]
        );

        return response()->json(['status' => true, 'message' => 'Rating saved!']);
    }
}
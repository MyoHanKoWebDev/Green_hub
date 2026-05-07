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
        $projectId = $request->filled('project_id') ? $request->query('project_id') : null;
        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');

        // Use one variable for sort logic
        $sort = $request->query('sort', 'newest');
        $perPage = $request->query('per_page', 6);

        $query = GreenProduct::where('stock_qty', '>=', 0)
            ->with(['ecoProjects' => function ($query) {
                $query->select('eco_projects.id', 'title');
            }])
            ->withCount('ratings')
            ->withAvg('ratings', 'rating');

        // 2. Apply Filters
        $query->when($search, function ($q, $search) {
            return $q->where(function ($sub) use ($search) {
                $sub->where('productName', 'LIKE', "%{$search}%");
            });
        })
            ->when($projectId, function ($q, $projectId) {
                return $q->whereHas('ecoProjects', function ($sub) use ($projectId) {
                    $sub->where('eco_projects.id', $projectId);
                });
            })
            ->when($request->filled('min_price'), function ($query) use ($minPrice) {
                // Cast to float to match the decimal precision in DB
                return $query->where('price', '>=', (float)$minPrice);
            })
            ->when($request->filled('max_price'), function ($query) use ($maxPrice) {
                return $query->where('price', '<=', (float)$maxPrice);
            });

        // 3. Optimized Sorting Logic (Fixed the 500 error)
        if ($sort === 'popular') {
            // Must match the naming convention of withAvg
            $query->orderBy('ratings_avg_rating', 'desc');
        } else {
            // Default to newest
            $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate($perPage);

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
        // 1. Find the current product with its projects
        $product = GreenProduct::with([
            'ecoProjects' => function ($q) {
                // Get the video URL and description from the associated project
                $q->select('eco_projects.id', 'title', 'description', 'video');
            },
        ])
        ->withCount('ratings')
    ->withAvg('ratings', 'rating')
    ->findOrFail($id);
        // 2. Get the ID of the first associated project
        $projectId = $product->ecoProjects->first()?->id;

        // 3. Find other products sharing that project ID
        $recommendations = [];
        if ($projectId) {
            $recommendations = GreenProduct::where('id', '!=', $id) // Exclude current product
                ->whereHas('ecoProjects', function ($query) use ($projectId) {
                    $query->where('eco_projects.id', $projectId);
                })
                ->with(['ecoProjects' => function ($query) {
                    $query->select('eco_projects.id', 'title');
                }])
                ->where('stock_qty', '>=', 0)
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
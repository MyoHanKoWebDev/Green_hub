<?php

namespace App\Http\Controllers\api\admin;

use App\Http\Controllers\Controller;
use App\Models\EcoProject;
use App\Models\Purchase;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        // Define the date ranges for comparison
        $currentMonth = [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()];
        $lastMonth = [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()];

        // 1. New Monthly Members
        $monthlyMembers = User::whereBetween('created_at', $currentMonth)->count();
        $prevMembers = User::whereBetween('created_at', $lastMonth)->count();
        $memberChange = $this->calculateChange($monthlyMembers, $prevMembers);

        // 2. New Monthly Orders
        $monthlyOrders = Purchase::whereBetween('created_at', $currentMonth)->count();
        $prevOrders = Purchase::whereBetween('created_at', $lastMonth)->count();
        $orderChange = $this->calculateChange($monthlyOrders, $prevOrders);

        // 3. Monthly Member-Only Projects
        // We filter by 'role' => 'member' as defined in your project retrieval logic
        $monthlyProjects = EcoProject::where('role', 'member')
            ->whereBetween('created_at', $currentMonth)
            ->count();

        $prevProjects = EcoProject::where('role', 'member')
            ->whereBetween('created_at', $lastMonth)
            ->count();

        $projectChange = $this->calculateChange($monthlyProjects, $prevProjects);

        return response()->json([
            'status' => true,
            'data' => [
                'members' => ['total' => $monthlyMembers, 'change' => $memberChange],
                'orders' => ['total' => $monthlyOrders, 'change' => $orderChange],
                'projects' => ['total' => $monthlyProjects, 'change' => $projectChange],
            ]
        ]);
    }

    public function getSalesChart(Request $request)
    {
        $year = $request->query('year', date('Y'));

        // Initialize all 12 months with 0.00
        $monthlyRevenue = array_fill(1, 12, 0);

        // Join Purchase -> PurchaseDetail -> GreenProduct
        // We sum (purchase_details.quantity * green_products.price)
        $sales = Purchase::join('purchase_details', 'purchases.id', '=', 'purchase_details.purchase_id')
            ->join('green_products', 'purchase_details.product_id', '=', 'green_products.id')
            ->selectRaw('MONTH(purchases.purchaseDate) as month, SUM(purchase_details.quantity * green_products.price) as total')
            ->whereYear('purchases.purchaseDate', $year)
            ->where('purchases.status', 'confirmed') // Only count successful sales
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        foreach ($sales as $month => $total) {
            $monthlyRevenue[$month] = (float) $total;
        }

        return response()->json([
            'status' => true,
            'data' => array_values($monthlyRevenue)
        ]);
    }

    public function getTopProjectTypes()
{
    // Following the schema lines verbatim from image_93181b.png
    $data = DB::table('purchase_details')
        ->join('green_products', 'purchase_details.product_id', '=', 'green_products.id')
        ->join('product_projects', 'green_products.id', '=', 'product_projects.product_id')
        ->join('eco_projects', 'product_projects.project_id', '=', 'eco_projects.id')
        ->join('project_types', 'eco_projects.project_type_id', '=', 'project_types.id')
        ->join('purchases', 'purchase_details.purchase_id', '=', 'purchases.id')
        ->select(
            'project_types.typeName as name',
            DB::raw('COUNT(purchase_details.id) as count')
        )
        // Only count confirmed purchases as per your existing sales logic
        ->where('purchases.status', 'confirmed')
        ->groupBy('project_types.id', 'project_types.typeName')
        ->orderBy('count', 'desc')
        ->limit(5)
        ->get();

    return response()->json([
        'status' => true,
        'data' => $data
    ]);
}

    private function calculateChange($current, $previous)
    {
        if ($previous == 0) return $current > 0 ? 100 : 0;
        return round((($current - $previous) / $previous) * 100, 2);
    }
}

<?php
namespace App\Http\Controllers\PublicArea\Employees;

use App\Models\Employee;
use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        try {
            $user = Auth::user();
            $organisation = Organisation::find($user->organisation_id);

            $employees = $organisation->employees()->get()->map(function ($item) {
                $item['vehicles'] = $item->vehicles()->get();
                return $item;
            });
            return response()->json([
                'employees' => $employees,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

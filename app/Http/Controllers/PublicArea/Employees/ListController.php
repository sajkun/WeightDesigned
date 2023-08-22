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
    public function __invoke(Request $request, $organisation_id)
    {
        try {
            $this->authorize('viewAny', [Employee::class, $organisation_id]);
            $employees = Employee::where('organisation_id', $organisation_id)->get();
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

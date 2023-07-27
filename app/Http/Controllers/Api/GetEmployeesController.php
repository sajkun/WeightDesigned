<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Employee;

class GetEmployeesController extends Controller
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
            $request->validate([
                'user_id' => 'required',
            ]);

            if ($request->user_id < 0) {
                return [
                    'error' => 'unauthorized user'
                ];
            }

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

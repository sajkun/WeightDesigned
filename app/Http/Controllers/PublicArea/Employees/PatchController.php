<?php
namespace App\Http\Controllers\PublicArea\Employees;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PatchController extends Controller
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
            $this->authorize('create', [Employee::class, $user->organisation_id]);

            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'edited_employee' => 'required',
            ]);

            $edited_employee = $request->edited_employee;
            $new_edited_employee = Employee::find($edited_employee['id']);
            $new_edited_employee->update((array)$edited_employee);
            return [
                'edited_employee' => $edited_employee,
            ];
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

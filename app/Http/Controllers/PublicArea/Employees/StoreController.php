<?php
namespace App\Http\Controllers\PublicArea\Employees;

use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        $this->authorize('create', [Employee::class, $user->organisation_id]);

        $request->validate([
            'user_id' => 'required',
            'organisation_id' => 'required',
            'edited_employee' => 'required',
        ]);

        $edited_employee = $request->edited_employee;
        $edited_employee['organisation_id'] = $request->organisation_id;

        unset($edited_employee['id']);

        $edited_employee = Employee::create($edited_employee);

        return [
            'edited_employee' => $edited_employee,
        ];
    }
}

<?php
namespace App\Http\Controllers\PublicArea\Employees;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

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
        $request->validate([
            'user_id' => 'required',
            'organisation_id' => 'required',
            'edited_employee' => 'required',
        ]);

        $edited_employee = $request->edited_employee;
        $edited_employee['organisation_id'] = $request->organisation_id;

        return [
            'user' => $user,
            'edited_employee' => $edited_employee,
            'organisation_id' => $request->organisation_id,
        ];
    }
}

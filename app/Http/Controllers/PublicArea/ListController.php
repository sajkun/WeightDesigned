<?php
namespace App\Http\Controllers\PublicArea;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Organisation;
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

            return response()->json([
                'bunkers' => $organisation->bunkers()->get()->map(function ($item) {
                    $employee = $item->employee()->first();
                    $item['employee_name'] = $employee ? "$employee->last_name $employee->first_name $employee->middle_name " : '-';
                    $item['employee'] = $employee ;
                    $item['type'] = 'bunker' ;
                    $item['pin'] = $item->pincode()->first() ;
                    return $item;
                }),
                // 'tractors' => $organisation->tractors()->get(),
                // 'transporters' => $organisation->transporters()->get(),
                // 'harvesters' => $organisation->harvesters()->get(),
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

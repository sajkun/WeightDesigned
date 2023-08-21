<?php
namespace App\Http\Controllers\PublicArea\Vehicle;

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

            $vehicles = $organisation->vehicles()->get()->map(function ($item) {
                $employee = $item->employee()->first();
                $item['employee_name'] = $employee ? "$employee->last_name $employee->first_name $employee->middle_name " : '-';
                $item['employee'] = $employee ;
                $item['pin'] = $item->pincode()->first() ;
                $item['rfids'] = $item->rfids()->get() ;
                return $item;
            });

            $bunkers = $vehicles->filter(function ($item) {
                return $item['type'] === 'bunker';
            });
            $tractors = $vehicles->filter(function ($item) {
                return $item['type'] === 'tractor';
            });
            $transporters = $vehicles->filter(function ($item) {
                return $item['type'] === 'transporter';
            });
            $harvesters = $vehicles->filter(function ($item) {
                return $item['type'] === 'harvester';
            });

            return response()->json([
                'bunkers' => $bunkers->toArray(),
                'tractors' => $tractors->toArray(),
                'transporters' => $transporters->toArray(),
                'harvesters' => $harvesters->toArray(),
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

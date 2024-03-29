<?php

namespace App\Http\Controllers\PublicArea\Vehicle;

use App\Models\Group;
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

            $vehicles = $organisation->getVehicleData();

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

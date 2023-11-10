<?php

namespace App\Http\Controllers\PublicArea\BvsData;

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
            $bvs_data = $organisation->bvsData();

            $bvs_data = array_map(function ($data) {
                $data['amount_in_bunker'] = abs($data['amount_in_bunker']);
                $data['amount_transfered'] = abs($data['amount_transfered']);
                return $data;
            }, $bvs_data);

            return response()->json([
                'bvs_data' => $bvs_data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'type' => 'error'
            ], $e->getCode());
        }
    }
}

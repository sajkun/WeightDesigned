<?php

namespace App\Http\Controllers\PublicArea\BvsData;

use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class SingleItemController extends Controller
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

            if ((int)$request->organisation_id !== (int)$organisation->id) {
                throw new \ErrorException('Запрос данных другой организации', 403);
            }

            $bvs_data = $organisation->bvsDataByOwner($request->params['id'], $request->params['type']);

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

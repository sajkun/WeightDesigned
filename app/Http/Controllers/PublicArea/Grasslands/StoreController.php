<?php
namespace App\Http\Controllers\PublicArea\Grasslands;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Grassland;
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
        try {
            $this->authorize('create', [Grassland::class, $request->organisation_id]);

            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'grassland_data' => 'required',
            ]);
            $new_grassland_data = $request->grassland_data;

            $new_grassland_data['organisation_id'] = $request->organisation_id;
            // unset($new_grassland_data['geo_json']);

            $new_grassland_data['geo_json'] = json_encode($new_grassland_data['geo_json']);
            $new_grassland = Grassland::create($new_grassland_data);

            return response()->json([
                'new_grassland' => $new_grassland,
                'new_grassland_data' => $new_grassland_data,
                'type' => 'success',
                'message' => sprintf('Запись о поле %s успешно добавлена', $new_grassland['name']),

            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

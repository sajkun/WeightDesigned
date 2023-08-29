<?php
namespace App\Http\Controllers\PublicArea\Grasslands;

use App\Models\Grassland;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
            $this->authorize('update', [Grassland::class, (int)$request->organisation_id]);

            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'grassland_data' => 'required',
            ]);

            $new_grassland_data = $request->grassland_data;

            $new_grassland = Grassland::find((int)$new_grassland_data['id']);

            if ($new_grassland_data['geo_json']) {
                $new_grassland_data['geo_json'] = json_encode($new_grassland_data['geo_json']);
            } else {
                unset($new_grassland_data['geo_json']);
            }

            if (!$new_grassland) {
                throw new \ErrorException('Редактируемое поле не найдено', 404);
            }

            $new_grassland->update((array)$new_grassland_data);
            $new_grassland->save();

            return response()->json([
                'new_grassland' => $new_grassland,
                'new_grassland_data' => $new_grassland_data,
                'type' => 'success',
                'message' => sprintf('Запись о поле %s успешно обновлена', $new_grassland['name']),
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

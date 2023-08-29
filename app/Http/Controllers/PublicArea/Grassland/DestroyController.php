<?php
namespace App\Http\Controllers\PublicArea\Grassland;

use App\Http\Controllers\Controller;
use App\Models\Grassland;
use Illuminate\Http\Request;

class DestroyController extends Controller
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
            $request->validate([
                'organisation_id' => 'required',
                'user_id' => 'required',
                'delete_grassland_id' => 'required',
            ]);
            $organisation_id = (int)$request->organisation_id;
            $delete_grassland_id = $request->delete_grassland_id;
            $user = auth()->user();
            $this->authorize('delete', [Grassland::class, $organisation_id]);

            if ($user->organisation_id != $organisation_id) {
                throw new \ErrorException('невторизованный запрос', 403);
            }

            $delete_grassland = Grassland::find($delete_grassland_id);

            if (!$delete_grassland) {
                throw new \ErrorException('Попытка удалить несуществующее поле', 404);
            }

            if ($delete_grassland->organisation_id != $organisation_id) {
                throw new \ErrorException('Попытка удалить поле другой организации', 403);
            }

            $delete_grassland->delete();
            $delete_grassland = '';
            return response()->json([
                'user' => $user,
                'organisation_id' => $organisation_id,
                'delete_grassland' => $delete_grassland,
            ], 200);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

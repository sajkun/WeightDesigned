<?php
namespace App\Http\Controllers\PublicArea\Rfid;

use App\Models\Rfid;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CheckController extends Controller
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
            $rfid = Rfid::where(['value' => $request->value, 'organisation_id' => $request->organisation_id])->first();

            if ($rfid) {
                throw new \ErrorException('Такая метка уже существует в системе', 403);
            }

            return response()->json([
                'type' => 'success',
                'message' => 'Метка не зарегистрирована',
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

<?php
namespace App\Http\Controllers\PublicArea\Bunker;

use App\Models\Bunker;
use App\Models\Pincode;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Organisation;

class CheckPinController extends Controller
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
            $pincode = Pincode::where([
                'name' => $request->name,
                'pin' => $request->pin
            ])->first();

            if (!$pincode) {
                throw new \ErrorException(' Неверная пара имя - пинкод', 403);
            };

            if (boolval($pincode->checkIfRegistered())) {
                throw new \ErrorException('Техника уже зарегистрирована', 403);
            };

            return  response()->json([
                'type' => 'success',
                'message' => 'Пинкод верен',

            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

<?php
namespace App\Http\Controllers\PublicArea\Bunker;

use App\Http\Controllers\Controller;
use App\Models\Pincode;
use Illuminate\Http\Request;

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
                return  [
                    'type' => 'error',
                    'message' => ' Неверная пара имя - пинкод',
                ];
            };

            if ($pincode->checkIfRegistered()) {
                return  [
                    'type' => 'error',
                    'message' => 'Техника уже зарегистрирована',
                ];
            };

            return  [
                'type' => 'success',
                'message' => 'Пинкод верен',
            ];
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

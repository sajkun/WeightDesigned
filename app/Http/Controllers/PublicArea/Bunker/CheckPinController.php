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
                    'message' => ' Неверная пара имя - пинкод',
                ];
            };

            if ($pincode->updated_at) {
                return  [
                    'message' => 'Техника уже зарегистрирована',
                ];
            };

            if ($pincode) {
                return  [
                    'message' => 'Пинкод верен',
                ];
            };

            return  [
                'message' => 'Неизвестная ошибка',
            ];
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

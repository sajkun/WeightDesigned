<?php

/**
 * Отображает данные о технике
 */

namespace App\Http\Controllers\Api;


use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ListVehiclesController extends Controller
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
            if (!$request->organisation_id) {
                throw new \Exception("Некорректный запрос", 400);
            }
            $organisation = Organisation::find($request->organisation_id);

            if (!$organisation) {
                throw new \Exception("Организация не существует в системе", 404);
            }

            $vehicles = $organisation->getVehicleData(true, false, false, false)->toArray();

            return response()->json(
                $vehicles,
                200,
                ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'],
                JSON_UNESCAPED_UNICODE
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => $e->getMessage(),
                    'status' => $e->getCode(),
                ],
                $e->getCode(),
                ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'],
                JSON_UNESCAPED_UNICODE
            );
        }
    }
}

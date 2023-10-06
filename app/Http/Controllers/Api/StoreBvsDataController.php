<?php
namespace App\Http\Controllers\Api;

use App\Models\BvsData;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class StoreBvsDataController extends Controller
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
            $validate_rules = [
                'operation_time' => 'string|required',
                'amount_in_bunker' => 'integer',
                'amount_transfered' => 'integer|required',
                'accelerometer' => 'string',
                'has_check' => 'boolean|required',
                'to' => 'string|required',
                'from' => 'string|required',
                'bvs_name' => 'string|required',
                'rfid_status' => 'integer|required',
                'coordinates' => 'string',
            ];

            $validator = Validator::make($request->all(), $validate_rules);

            if ($validator->fails()) {
                $errors = $validator->errors();
                return [
                    'status' => 400,
                    'message' => 'Bad Request',
                    'errors' => $errors,
                ];
            }

            $data = $validator->validated();
            $data_stored = BvsData::create($data);

            return response()->json([
                'message' => 'success',
                'status' => 200,
                // 'data_stored' => $data_stored,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => $e->getCode(),
            ], $e->getCode());
        }
    }
}

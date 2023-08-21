<?php
namespace App\Http\Controllers\PublicArea\Vehicle;

use App\Models\Rfid;
use App\Models\Pincode;
use App\Models\Vehicle;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
            $this->authorize('create', [Vehicle::class, $request->organisation_id]);

            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'post_data' => 'required',
            ]);

            // форматирование данных бункера
            $may_be_vehicle = $request->post_data;
            $may_be_vehicle['organisation_id'] = (int)$request->organisation_id;

            // проверка уникальности имени бункера
            $exists_vehicle = Vehicle::where(['name' => $may_be_vehicle['name']])->first();

            if ($exists_vehicle) {
                throw new \ErrorException('Техника с таким именем уже создана', 403);
            }

            $employee = null;
            if (isset($request->employee_id)) {
                $employee = Employee::find($request->employee_id);
                if ((int)$employee->id !== (int)$request->organisation_id) {
                    throw new \ErrorException('Ошибка добавления ответственного', 403);
                }
            }

            $pincode = null;
            if ($may_be_vehicle['pin']) {
                $pincode = Pincode::where([
                    'name' => $may_be_vehicle['name'],
                    'pin' => (int)$may_be_vehicle['pin']
                ])->first();

                if (!$pincode) {
                    throw new \ErrorException(' Неверная пара имя - пинкод', 403);
                }

                if ($pincode->checkIfRegistered()) {
                    throw new \ErrorException('Техника уже зарегистрирована', 403);
                };
            }

            $add_message = !$pincode && $may_be_vehicle['type'] === 'bunker' ? ' Для просмотра данных весовой системы вам потребуется ввести пин код' : '';
            unset($may_be_vehicle['pin']);

            $vehicle = Vehicle::create($may_be_vehicle);

            if ($pincode) {
                $vehicle->pincode()->save($pincode);
            }

            if ($employee) {
                $vehicle->employee()->associate($employee)->save();
            }

            if (isset($request->rfids) && count($request->rfids) > 0) {
                $rfids = array_map(function ($rfid) use ($vehicle) {
                    $rfid['vehicle_id'] = $vehicle['id'];
                    return $rfid;
                }, $request->rfids);

                Rfid::insert($rfids);
            }

            return response()->json([
                'vehicle' => $vehicle,
                'type' => 'success',
                'message' => 'Техника создана успешно.' . $add_message,
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

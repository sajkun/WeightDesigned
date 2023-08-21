<?php
namespace App\Http\Controllers\PublicArea\Vehicle;

use App\Models\Vehicle;
use App\Models\Pincode;
use App\Models\Employee;
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
            $this->authorize('update', [Vehicle::class, $request->organisation_id]);

            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'post_data' => 'required',
            ]);

            // форматирование данных бункера
            $new_bunker_data = $request->post_data;
            $new_bunker_data['organisation_id'] = (int)$request->organisation_id;

            // проверка уникальности имени бункера
            $bunker_to_edit = Vehicle::find((int)$new_bunker_data['id']);

            if (!$bunker_to_edit) {
                throw new \ErrorException('Не найдена запись редактируемой техники', 404);
            }

            $employee = null;

            if (isset($request->employee_id)) {
                $employee = Employee::find($request->employee_id);
                if ((int)$employee->id !== (int)$request->organisation_id) {
                    throw new \ErrorException('Ошибка добавления ответственного', 403);
                }
            }

            $pincode = null;

            if (isset($new_bunker_data['pin'])) {
                $pincode = Pincode::where([
                    'name' => $new_bunker_data['name'],
                    'pin' => (int)$new_bunker_data['pin']
                ])->first();

                if (!$pincode) {
                    throw new \ErrorException(' Неверная пара имя - пинкод', 403);
                }

                if ($pincode->checkIfRegistered()) {
                    throw new \ErrorException('Техника уже зарегистрирована', 403);
                };
            }

            $add_message = !$pincode ? ' Для просмотра данных весовой системы вам потребуется ввести пин код' : '';
            unset($new_bunker_data['pin'], $new_bunker_data['id']);

            $bunker_to_edit->update((array)$new_bunker_data);

            if ($pincode) {
                $bunker_to_edit->pincode()->save($pincode);
            }

            if ($employee) {
                $bunker_to_edit->employee()->associate($employee)->save();
            } else {
                $exists_employee = $bunker_to_edit->employee()->first();
                $bunker_to_edit->employee()->dissociate($exists_employee)->save();
            }

            return response()->json([
                'bunker_to_edit' => $bunker_to_edit,
                'new_bunker_data' => $new_bunker_data,
                'type' => 'success',
                'message' => 'Техника обновлена успешно.' . $add_message,
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

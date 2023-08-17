<?php
namespace App\Http\Controllers\PublicArea\Bunker;

use App\Models\Bunker;
use App\Models\Pincode;
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
            $user = Auth::user();
            $may_be_bunker = $request->post_data;
            $employee = Employee::find($request->employee_id);

            if ((int)$employee->id !== (int)$request->organisation_id) {
                throw new \ErrorException('Ошибка добавления рабочего', 403);
            }

            $may_be_bunker['name'] = strtolower($may_be_bunker['name']);

            $this->authorize('create', [Bunker::class, $user->organisation_id]);
            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'post_data' => 'required',
            ]);

            $may_be_bunker['organisation_id'] = (int)$request->organisation_id;

            $exists_bunker = Bunker::where(['name' => $may_be_bunker['name']])->first();

            if ($exists_bunker) {
                throw new \ErrorException('Техника с таким именем уже создана', 403);
            }

            if ($may_be_bunker['pin']) {
                $pincode = Pincode::where([
                    'name' => $may_be_bunker['name'],
                    'pin' => (int)$may_be_bunker['pin']
                ])->first();

                if (!$pincode) {
                    throw new \ErrorException(' Неверная пара имя - пинкод', 403);
                }

                if ($pincode->checkIfRegistered()) {
                    throw new \ErrorException('Техника уже зарегистрирована', 403);
                };
            }

            // return $may_be_bunker;
            $add_message = !$may_be_bunker['pin'] ? ' Для просмотра данных весовой системы вам потребуется ввести пин код' : '';
            unset($may_be_bunker['pin']);

            $bunker = Bunker::create($may_be_bunker);

            if (isset($pincode)) {
                $bunker->pincode()->save($pincode);
            }

            if ($employee) {
                $bunker->employee()->associate($employee)->save();
            }

            return response()->json([
                'bunker' => $bunker,
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

<?php
namespace App\Http\Controllers\PublicArea\Employee;

use App\Models\Vehicle;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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
            $user = Auth::user();
            $this->authorize('create', [Employee::class, $user->organisation_id]);

            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'edited_employee' => 'required',
            ]);

            $edited_employee = $request->edited_employee;
            $new_edited_employee = Employee::find($edited_employee['id']);

            $nex_vehicles_idx = array_map(function ($item) {
                return $item['id'];
            }, $edited_employee['vehicles']);

            $new_edited_employee->vehicles()->get()->filter(
                function ($item) use ($nex_vehicles_idx) {
                    if (!in_array($item['id'], $nex_vehicles_idx)) {
                        $item->update(['employee_id' => null]);
                    }
                    return $item['employee_id'];
                }
            );

            foreach ($nex_vehicles_idx as $id) {
                $vehicle = Vehicle::find($id);
                $vehicle->update(['employee_id' => $new_edited_employee['id']]);
            }

            unset($edited_employee['vehicles']);
            $new_edited_employee->update((array)$edited_employee);
            $new_edited_employee->save();
            return [
                'edited_employee' => $edited_employee,
                'nex_vehicles_idx' => $nex_vehicles_idx,
                'vehicles' => $new_edited_employee->vehicles()->get(),

                'type' => 'success',
                'message' => $new_edited_employee->specialisation . ' ' . $new_edited_employee->last_name . ' изменен'
            ];
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

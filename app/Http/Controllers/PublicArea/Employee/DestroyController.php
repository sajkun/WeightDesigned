<?php
namespace App\Http\Controllers\PublicArea\Employee;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Employee;

class DestroyController extends Controller
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
            $request->validate([
                'organisation_id' => 'required',
                'user_id' => 'required',
                'delete_employee_id' => 'required',
            ]);
            $organisation_id = $request->organisation_id;
            $delete_employee_id = $request->delete_employee_id;
            $user = auth()->user();
            $this->authorize('delete', [Employee::class, $organisation_id]);

            if ($user->organisation_id != $organisation_id) {
                throw new \ErrorException('невторизованный запрос', 403);
            }

            $delete_employee = Employee::find($delete_employee_id);

            if (!$delete_employee) {
                throw new \ErrorException('Попытка удалить несуществующего сотрудника', 404);
            }

            if ($delete_employee->organisation_id != $organisation_id) {
                throw new \ErrorException('Попытка удалить пользователя другой организации', 403);
            }

            $delete_employee->delete();
            return response()->json([
                'user' => $user,
                'organisation_id' => $organisation_id,
                'delete_employee' => $delete_employee,
                'message' => $delete_employee->specialisation . ' ' . $delete_employee->last_name . ' удален',
                'type' => 'success'
            ], 200);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

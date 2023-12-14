<?php

namespace App\Http\Controllers\PublicArea\SessionTask;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Vehicle;

class SearchController extends Controller
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
                'vehicle_id' => 'required',
                'employee_id' => 'required',
                'start' => 'required',
                'end' => 'required',
            ]);


            $current_task_id = $request->id ? $request->id : -1;

            // throw new \ErrorException('Тестим проверку' . $current_task_id, 404);


            $start = new \DateTime($request->start);
            $end = new \DateTime($request->end);
            $employee_id = $request->employee_id;
            $vehicle_id = $request->vehicle_id;

            $employee = Employee::find($employee_id);
            $vehicle = Vehicle::find($vehicle_id);

            $tasks = DB::table('session_tasks')
                ->where(function ($query) use ($start, $end) {
                    $query->where(function ($query) use ($start) {
                        $query->whereDate('start',  $start)->whereTime('start', '<=', $start)->whereTime('end', '>', $start);
                    })->orWhere(function ($query) use ($end) {
                        $query->whereDate('end',  $end)->whereTime('start', '<', $end)->whereTime('end', '>=', $end);
                    })->orWhere(function ($query) use ($end, $start) {
                        $query->whereDate('end',  $end)->whereTime('start', '>', $start)->whereTime('end', '<', $end);
                    });
                })
                ->where(function ($query) use ($request) {
                    $query->where('employee_id', (int)$request->employee_id)->orWhere('vehicle_id', (int)$request->vehicle_id);
                })
                ->where('id', '!=', (int)$current_task_id)
                ->get();



            $task_exists = count($tasks) > 0;

            $response = [
                'task_exists' => $task_exists,
                'tasks' => $tasks,
            ];

            if ($task_exists) {
                $response['message'] = sprintf("Невозможно назначить механизатора %s на %s в это время", $employee['last_name'], $vehicle['name']);
                $response['type'] = 'error';
            }

            return response()->json($response);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'type' => 'error',
            ], $e->getCode());
        }
    }
}

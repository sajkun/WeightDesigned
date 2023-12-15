<?php
/* Проверка сменного задания на возможные коллизии по времени по сравнению с ранее созданными заданиями */

namespace App\Http\Controllers\PublicArea\SessionTask;

use App\Models\Vehicle;
use App\Models\Employee;
use Illuminate\Http\Request;
use App\Http\Controllers\PublicArea\SessionTask\GeneralController;

class SearchController extends GeneralController
{
    /**
     * Обработка входящего запроса
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

            $employee_id = $request->employee_id;
            $vehicle_id = $request->vehicle_id;

            // id текущего задания, необходимо для проверки возможности изменения уже имеющегося задания
            $current_task_id = $request->id ? $request->id : -1;
            $start = new \DateTime($request->start);
            $end = new \DateTime($request->end);


            if ($this->taskTakes2Days($start, $end)) {
                $end_of_start_day = new \DateTime($request->start);
                $end_of_start_day->setTime(23, 59, 59);

                $start_of_end_day =
                    new \DateTime($request->end);
                $start_of_end_day->setTime(0, 0, 1);

                $tasks_data = [
                    [
                        'start' => $start,
                        'end' => $end_of_start_day,
                        'employee_id' => $employee_id,
                        'vehicle_id' => $vehicle_id,
                        'current_task_id' => $current_task_id,
                    ],
                    [
                        'start' => $start_of_end_day,
                        'end' => $end,
                        'employee_id' => $employee_id,
                        'vehicle_id' => $vehicle_id,
                        'current_task_id' => $current_task_id,
                    ]
                ];
            } else {
                $tasks_data = [
                    [
                        'start' => $start,
                        'end' => $end,
                        'employee_id' => $employee_id,
                        'vehicle_id' => $vehicle_id,
                        'current_task_id' => $current_task_id,
                    ]
                ];
            }

            $test = [];

            $task_exists = false;
            foreach ($tasks_data as $task) {
                $test[] = $task_exists = $this->hasTaskCollisions($task['start'], $task['end'], $task['employee_id'], $task['vehicle_id'], $task['current_task_id']) ?: $task_exists;
            }

            $response = [
                'task_exists' => $task_exists,
            ];

            if ($task_exists) {
                $employee = Employee::find($employee_id);
                $vehicle = Vehicle::find($vehicle_id);
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

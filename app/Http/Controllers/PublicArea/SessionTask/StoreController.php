<?php

namespace App\Http\Controllers\PublicArea\SessionTask;

use App\Models\SessionTask;
use Illuminate\Http\Request;
use App\Http\Controllers\PublicArea\SessionTask\GeneralController;

class StoreController extends GeneralController
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
            // $this->authorize('create', [SessionTask::class, $request->organisation_id]);

            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'task' => 'required',
            ]);

            $new_task_data = $request->task;

            $new_task_data['organisation_id'] = (int)$request->organisation_id;

            $start = new \DateTime($new_task_data['start']);
            $end =  new \DateTime($new_task_data['end']);

            $task_data = [$new_task_data];
            $task_data[0]['start'] = $start;
            $task_data[0]['end'] = $end;

            if ($this->taskTakes2Days($start, $end)) {
                $end_of_start_day = new \DateTime($new_task_data['start']);
                $end_of_start_day->setTime(23, 59, 59);

                $start_of_end_day =
                    new \DateTime($new_task_data['end']);
                $start_of_end_day->setTime(0, 0, 1);

                $task_data[1] = $task_data[0];

                $task_data[0]['end'] = $end_of_start_day;
                $task_data[1]['start'] = $start_of_end_day;
            }

            foreach ($task_data as $new_task_data) {
                SessionTask::create($new_task_data);
            }

            return response()->json([
                'message' => 'Запись о задании успешно добавлена',
                'type' => 'success'
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'type' => 'error',
            ], $e->getCode());
        }
    }
}

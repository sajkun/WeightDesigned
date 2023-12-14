<?php

namespace App\Http\Controllers\PublicArea\SessionTask;

use Illuminate\Http\Request;
use App\Http\Controllers\PublicController;
use App\Models\SessionTask;

class StoreController extends PublicController
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

            $new_task_data['start'] = new \DateTime($new_task_data['start']);
            $new_task_data['end'] = new \DateTime($new_task_data['end']);

            $new_task = SessionTask::create($new_task_data);
            return response()->json([
                'new_task' => $new_task,
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

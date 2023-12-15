<?php

namespace App\Http\Controllers\PublicArea\SessionTask;

use App\Http\Controllers\PublicController;
use App\Models\SessionTask;
use Illuminate\Http\Request;

class PatchController extends PublicController
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
            $this->authorize('update', [SessionTask::class, (int)$request->organisation_id]);

            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'task' => 'required',
            ]);

            $new_task_data = $request->task;
            $new_task = SessionTask::find((int)$new_task_data['id']);

            if (!$new_task) {
                throw new \ErrorException('Редактируемое сменное задание не найдено', 404);
            }

            $new_task_data['start'] = new \DateTime($new_task_data['start']);
            $new_task_data['end'] = new \DateTime($new_task_data['end']);

            $new_task->update((array)$new_task_data);
            $new_task->save();

            return response()->json([
                'new_task' => $new_task,
                'type' => 'success',
                'message' => 'Сменное задание успешно обновлено',
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'type' => 'error',
            ], $e->getCode());
        }
    }
}

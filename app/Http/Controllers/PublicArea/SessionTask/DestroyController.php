<?php

namespace App\Http\Controllers\PublicArea\SessionTask;

use App\Http\Controllers\PublicController;
use App\Models\SessionTask;
use Illuminate\Http\Request;

class DestroyController extends PublicController
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
                'delete_item_id' => 'required',
            ]);

            $organisation_id = $request->organisation_id;
            $delete_item_id = $request->delete_item_id;
            $user = auth()->user();
            // $this->authorize('delete', [SessionTask::class, $organisation_id]);

            if ($user->organisation_id != $organisation_id) {
                throw new \ErrorException('Невторизованный запрос', 403);
            }

            $delete_task = SessionTask::find($delete_item_id);

            if (!$delete_task) {
                throw new \ErrorException('Попытка удалить несуществующее сменное задание', 404);
            }

            if ($delete_task->organisation_id != $organisation_id) {
                throw new \ErrorException('Попытка удалить сменное задание другой организации', 403);
            }

            $delete_task->delete();

            return response()->json([
                'user' => $user,
                'organisation_id' => $organisation_id,
                'delete_task' => $delete_task,
                'message' => 'Сменное задание удалено',
                'type' => 'success'
            ], 200);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

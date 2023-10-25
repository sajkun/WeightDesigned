<?php
namespace App\Http\Controllers\PublicArea\User;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
            $this->authorize('delete', [User::class, (int)$request->organisation_id]);

            $request->validate([
                'organisation_id' => 'required',
                'user_id' => 'required',
                'delete_user_id' => 'required',
            ]);

            $user_id = $request->user_id;
            $organisation_id = $request->organisation_id;
            $delete_user_id = $request->delete_user_id;

            $user = User::find($user_id);

            if ($user->organisation_id != $organisation_id) {
                throw new \ErrorException('невторизованный запрос', 403);
            }

            if ($user->id == $delete_user_id) {
                throw new \ErrorException('Попытка удалить собственную учетную запись', 403);
            }

            $delete_user = User::find($delete_user_id);

            if (!$delete_user) {
                throw new \ErrorException('Попытка удалить несуществующего пользователя', 404);
            }

            if ($delete_user->organisation_id != $organisation_id) {
                throw new \ErrorException('Попытка удалить пользователя другой организации', 403);
            }

            $delete_user->delete();

            return response()->json([
                'delete_user' => $delete_user,
            ], 200);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

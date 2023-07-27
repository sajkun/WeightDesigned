<?php
namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class SetUserPasswordController extends Controller
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
                'old_password' => 'required',
                'new_password' => 'required',
                'organisation_id' => 'required',
                'user_id' => 'required',
                'edit_user_id' => 'required',
            ]);

            $user_id = $request->user_id;
            $organisation_id = $request->organisation_id;
            $user = User::find($user_id);

            if ($user->organisation_id != $organisation_id) {
                throw new \ErrorException('невторизованный запрос', 403);
            }

            $edit_user = User::find($request->edit_user_id);

            if (!$edit_user) {
                throw new \ErrorException('Пользователь не найден', 404);
            }

            if (!Hash::check($request->old_password, $edit_user->password)) {
                throw new \ErrorException('Старый пароль указан не верно', 403);
            }

            $edit_user->update([
                'password' => Hash::make($request->new_password)
            ]);

            return response()->json([
                'message' => 'Пароль изменен успешно',
                'user_id' => $edit_user->id,
                'new_password' => $request->new_password
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

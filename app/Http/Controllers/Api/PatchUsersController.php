<?php
namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;

class PatchUsersController extends Controller
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
                'edit_user' => 'required',
            ]);

            $user_id = $request->user_id;
            $organisation_id = $request->organisation_id;

            $user = User::find($user_id);

            if ($user->organisation_id != $organisation_id) {
                throw new \ErrorException('невторизованный запрос', 403);
            }

            $new_data = $request->edit_user;
            $patch_user = User::find($new_data['id']);

            unset($new_data['login'],$new_data['password'], $new_data['id'], $new_data['created_at'], $new_data['created_at']);

            $patch_user->update($new_data);

            return response()->json([
                'user_id' => $user_id,
                'user' => $user,
                'patch_user' => $patch_user,
                'new_data' => $new_data,
            ], 200);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

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
        $user_id = $request->user_id;
        $organisation_id = $request->organisation_id;

        $user = User::find($user_id);

        if ($user->organisation_id != $organisation_id) {
            return [
                'error' => 'unauthorized',
            ];
        }

        $new_data = $request->edit_user;

        $patch_user = User::find($new_data['id']);

        unset($new_data['login'], $new_data['id'], $new_data['created_at'], $new_data['created_at']);

        $patch_user->update($new_data);

        return [
            'user_id' => $user_id,
            'user' => $user,
            'patch_user' => $patch_user,
            'new_data' => $new_data,
        ];
    }
}

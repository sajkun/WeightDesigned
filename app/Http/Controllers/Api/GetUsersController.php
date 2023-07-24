<?php
namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GetUsersController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function __invoke($organisation_id, Request $request)
    {
        if ($request->user_id < 0) {
            return [
                'error' => 'unauthorized user'
            ];
        }
        $users = User::where('organisation_id', $organisation_id)->get();
        $roles = config('users.roles_nice_names');
        unset($roles['admin'], $roles['superadmin']);

        $users->map(function ($u) use ($roles) {
            $u['role_name'] = $roles[$u['role']];
            unset($u['password'], $u['organisation_id']);

            return $u;
        });

        return [
            'users' => $users,
            'roles' => $roles,
        ];
    }
}

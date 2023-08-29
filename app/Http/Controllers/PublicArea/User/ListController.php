<?php
namespace App\Http\Controllers\PublicArea\User;

use App\Models\User;
use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ListController extends Controller
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
            $user = Auth::user();
            $organisation = Organisation::find($user->organisation_id);

            $roles = config('users.roles_nice_names');

            unset($roles['admin'], $roles['superadmin']);

            $users = $organisation->users()->get();

            $users->map(function ($u) use ($roles) {
                $u['role_name'] = $roles[$u['role']];
                unset($u['password'], $u['organisation_id']);
                return $u;
            });

            return response()->json([
                'users' => $users,
                'organisation' => $organisation,
                'roles' => $roles,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

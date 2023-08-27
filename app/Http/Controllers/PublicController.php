<?php
namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PublicController extends Controller
{
    public function __construct(Request $request)
    {
    }

    public function prepareData()
    {
        $user = Auth::user();
        $organisation = Organisation::find($user->organisation_id);
        $roles = config('users.roles_nice_names');

        unset($roles['admin'], $roles['superadmin']);

        view()->share('roles', $roles);
        view()->share('organisation', $organisation->name);
        view()->share('organisation_id', $organisation->id);
        view()->share('user_id', $user->id);
        view()->share('users', $organisation->users()->get());
        view()->share('employees', $organisation->employees()->get());
        view()->share('grasslands', $organisation->grasslands()->get());
    }
}

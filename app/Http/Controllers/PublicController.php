<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

class PublicController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function prepareData()
    {
        $path = public_path('/js/libs');
        $jslibs = array_map(function ($f) {
            return "/js/libs/{$f->getRelativePathname()}";
        }, File::allFiles($path));

        view()->share('jslibs', $jslibs);

        $user = Auth::user();
        $organisation = Organisation::find($user->organisation_id);
        $roles = config('users.roles_nice_names');

        $organisation->bvsData();

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

<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function showLoginForm()
    {
        return view('auth.login', ['bodyClass' => 'auth']);
    }

    protected function authenticated(Request $request, $user)
    {
        // if (in_array($user->role, config('users.admin_roles'))) {
        //     return(redirect()->route('admin.index'));
        // }

        //     if (in_array($user->role, config('users.customer_roles'))) {
        //         $organisation_id = $user->organisation_id;

        //         if (!$organisation_id) {
        //             abort(403);
        //         }

        return(redirect()->route('admin.index'));
        //     }
    }

    public function username()
    {
        return 'login';
    }
}

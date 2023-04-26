<?php
namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class IndexController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $organisations = Organisation::all();
        $organisations->map(
            function ($o) {
                $users = User::where('organisation_id', $o->id)->get();
                $o->users = $users;
                return $o;
            }
        );
        return view('admin.index', ['organisations' => $organisations]);
    }
}

<?php
namespace App\Http\Controllers\PublicArea\Users;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PublicController;

class IndexController extends PublicController
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $this->authorize('viewAny', [User::class, Auth::user()->organisation_id]);
        $this->prepareData();
        return view('pages.users.index');
    }
}
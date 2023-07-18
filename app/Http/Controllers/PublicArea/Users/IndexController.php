<?php
namespace App\Http\Controllers\PublicArea\Users;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PublicController;
use Illuminate\Http\Request;

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
        $this->prepareData();
        return view('pages.users.index');
    }
}

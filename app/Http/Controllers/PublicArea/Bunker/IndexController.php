<?php
namespace App\Http\Controllers\PublicArea\Bunker;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PublicController;
use App\Models\Bunker;

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
        $this->authorize('viewAny', [Bunker::class]);
        $this->prepareData();

        return view('pages.bunkers');
    }
}

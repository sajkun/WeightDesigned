<?php

namespace App\Http\Controllers\PublicArea\Vehicle;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PublicController;
use App\Models\Vehicle;

class IndexController extends PublicController
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Illuminate\Support\Facades\View
     */
    public function __invoke(Request $request, string $type)
    {
        $this->authorize('viewAny', [Vehicle::class]);
        $this->prepareData();
        return view('pages.vehicles', ['type' => $type]);
    }
}

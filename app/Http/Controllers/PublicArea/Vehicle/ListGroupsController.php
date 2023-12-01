<?php

/**
 * Получает список групп техники
 */

namespace App\Http\Controllers\PublicArea\Vehicle;

use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class ListGroupsController extends Controller
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
            $groups = $organisation->groups()->get()->toArray();
            return response()->json([
                'groups' => $groups
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

<?php
namespace App\Http\Controllers\PublicArea;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Organisation;
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

            return response()->json([
                'bunkers' => $organisation->bunkers()->get(),
                // 'tractors' => $organisation->tractors()->get(),
                // 'transporters' => $organisation->transporters()->get(),
                // 'harvesters' => $organisation->harvesters()->get(),
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

<?php
namespace App\Http\Controllers\PublicArea\Vehicle;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Vehicle;

class DestroyController extends Controller
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
            $request->validate([
                'organisation_id' => 'required',
                'user_id' => 'required',
                'delete_item' => 'required',
            ]);

            $this->authorize('delete', [Vehicle::class, $request->organisation_id]);

            $delete_bunker = Vehicle::find($request->delete_item['id']);
            $delete_bunker->delete();
            return response()->json([
                'delete_bunker' => $delete_bunker['id'],
                'message' => sprintf('%s удалён', $delete_bunker['name']),
                'type' => 'success'
            ]);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

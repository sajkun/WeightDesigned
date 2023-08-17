<?php
namespace App\Http\Controllers\PublicArea\Bunker;

use App\Models\Bunker;
use App\Models\Pincode;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
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
            $may_be_bunker = $request->post_data;
            $this->authorize('create', [Bunker::class, $user->organisation_id]);
            $request->validate([
                'user_id' => 'required',
                'organisation_id' => 'required',
                'post_data' => 'required',
            ]);

            $exists_bunker = Bunker::where(['name' => $may_be_bunker['name']])->get();

            if ($exists_bunker) {
                throw new \ErrorException('Техника с таким имененм уже создана', 418);
            }

            if ($may_be_bunker->pin) {
                $pincode = Pincode::where([
                    'name' => $may_be_bunker->name,
                    'pin' => $may_be_bunker->pin
                ])->first();

                if (!$pincode) {
                    throw new \ErrorException('Неверная пара имя - пинкод', 403);
                }
            }

            return $may_be_bunker;
        } catch (\Exception  $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

<?php
namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class StoreUserController extends Controller
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
                'new_user' => 'required',
            ]);

            $user_id = $request->user_id;
            $organisation_id = $request->organisation_id;
            $new_user = $request->new_user;

            $new_user['organisation_id'] = $organisation_id;

            $user = User::find($user_id);

            if ($user->organisation_id != $organisation_id) {
                throw new \ErrorException('невторизованный запрос', 403);
            }

            $maybe_user = User::where('login', $new_user['login'])->get();

            if (!$maybe_user->isEmpty()) {
                throw new \ErrorException('Пользователь с таким логином уже существует', 403);
            }

            $maybe_user = User::where('email', $new_user['email'])->get();

            if (!$maybe_user->isEmpty()) {
                throw new \ErrorException('Пользователь с такой электронной почтой уже существует', 403);
            }

            $maybe_user = User::where('phone', $new_user['phone'])->get();

            if (!$maybe_user->isEmpty()) {
                throw new \ErrorException('Пользователь с таким телефоном уже существует', 403);
            }

            $new_user['password'] = Hash::make($request->new_password);

            $new_user = User::create($new_user);

            return response()->json([
                'new_user' => $new_user,
            ], 200);
        } catch (\Exception  $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}

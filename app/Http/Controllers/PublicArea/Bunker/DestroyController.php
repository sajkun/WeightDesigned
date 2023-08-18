<?php
namespace App\Http\Controllers\PublicArea\Bunker;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

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
        //валидация запроса и проверка прав пользователя
        // удалить после теста
        // return response()->json([
        //     'type' => 'тест ответа',
        // ]);
        $user = Auth::user();
        $this->authorize('destroy', [Bunker::class, $user->organisation_id]);
    }
}

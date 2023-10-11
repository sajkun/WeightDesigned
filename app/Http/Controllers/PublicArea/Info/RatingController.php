<?php
/**
 * Отображение статистики предприятия
 */
namespace App\Http\Controllers\PublicArea\Info;

use App\Http\Controllers\PublicController;
use Illuminate\Http\Request;

class RatingController extends PublicController
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Illuminate\Support\Facades\View
     */
    public function __invoke(Request $request)
    {
        $this->prepareData();
        return view('pages.rating');
    }
}

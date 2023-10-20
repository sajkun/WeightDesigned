<?php
/**
 * Контроллер отображения страницы статистики публичного раздела
 */
namespace App\Http\Controllers\PublicArea\Info;

use Illuminate\Http\Request;
use App\Http\Controllers\PublicController;

class StatisticsController extends PublicController
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
        return view('pages.statistics');
    }
}

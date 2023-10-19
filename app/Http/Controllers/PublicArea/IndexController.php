<?php
namespace App\Http\Controllers\PublicArea;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PublicController;
use Illuminate\Http\Request;

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
        $this->prepareData();
        return view('pages.main');
    }

    /**
     * Метод определяющий нужно ли использовать яндекс карты
     */
    protected function useYamap()
    {
        return true;
    }
}

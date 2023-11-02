<?php

namespace App\Http\Controllers\PublicArea;

use App\Http\Controllers\PublicController;

class IndexController extends PublicController
{
    /**
     * отображает главную страницу кубличной зоны
     *
     * @return Illuminate\Support\Facades\View
     */
    public function __invoke()
    {
        $this->prepareData();
        return view('pages.main');
    }

    /**
     * Метод определяющий нужно ли загружать скрипт API яндекс карт
     *
     * @return boolean
     */
    protected function useYamap()
    {
        return true;
    }
}

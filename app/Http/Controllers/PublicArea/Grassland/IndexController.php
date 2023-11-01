<?php

namespace App\Http\Controllers\PublicArea\Grassland;

use App\Models\Grassland;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\File;

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
        $this->authorize('view', [Grassland::class, Auth::user()->organisation_id]);
        $this->prepareData();
        return view('pages.grasslands');
    }


    /**
     * Определяет для view массив путей сторонних библиотек
     */
    public function applyExternalJsLibs()
    {
        // получение всех js файлов и формирование массива путей
        $path = public_path('/js/libs');

        $jslibs = array_map(function ($f) {
            return "/js/libs/{$f->getRelativePathname()}";
        }, File::allFiles($path));

        view()->share('jslibs', $jslibs);

        return;
    }

    /**
     * Метод определяющий нужно ли загружать скрипт API яндекс карт
     */
    protected function useYamap()
    {
        return true;
    }
}

<?php
/**
 * Контроллер отображения главной страницы публичной зоны
 */
namespace App\Http\Controllers;

use App\Http\Controllers\PublicController;

class HomeController extends PublicController
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        
        return view('home');
    }
}

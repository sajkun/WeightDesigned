<?php
namespace App\Http\Controllers\PublicArea\Employees;

use Illuminate\Http\Request;
use App\Http\Controllers\PublicController;

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
        return view('pages.employees.index');
    }
}

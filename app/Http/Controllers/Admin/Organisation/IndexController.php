<?php
namespace App\Http\Controllers\Admin\Organisation;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\Organisation;
use App\Http\Controllers\Admin\AdminController;

class IndexController extends AdminController
{
    /**

     */
    public function __invoke(Request $request)
    {
        $this->authorize('viewAny', Organisation::class);
        $this->prepareData();
        return view('admin.organisation.index');
    }
}

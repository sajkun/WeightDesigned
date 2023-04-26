<?php
namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\Organisation;

class CreateController extends AdminController
{
    /**
     * Handle create organisations request
     */
    public function __invoke()
    {
        $this->authorize('create', Organisation::class);
        $this->prepareData();
        return view('admin.organisation.create');
    }
}

<?php
namespace App\Http\Controllers\Admin\Organisation;

use App\Http\Controllers\Admin\AdminController;
use App\Models\Organisation;

class EditController extends AdminController
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Organisation $organisation)
    {
        $this->authorize('edit', $organisation);
        $this->prepareData();
        return view('admin.organisation.edit', compact('organisation'));
    }
}

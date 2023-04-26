<?php
namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Admin\AdminController;

class CreateController extends AdminController
{
    /**
     * Handle new user creation.
     */
    public function __invoke()
    {
        $this->authorize('create', auth()->user());
        $this->prepareData();
        return view('admin.user.create');
    }
}

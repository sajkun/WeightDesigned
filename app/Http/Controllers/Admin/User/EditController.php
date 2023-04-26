<?php
namespace App\Http\Controllers\Admin\User;

use App\Models\User;
use App\Http\Controllers\Admin\AdminController;

class EditController extends AdminController
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(User $user)
    {
        $this->authorize('edit', auth()->user());
        $this->prepareData();
        return view('admin.user.edit', compact('user'));
    }
}

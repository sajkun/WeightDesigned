<?php
namespace App\Http\Controllers\Admin\User;

use App\Models\User;
use App\Http\Controllers\Controller;

class DestroyController extends Controller
{
    /**
     * Handle the delete user request.
     *
     */
    public function __invoke(User $user)
    {
        // $this->authorize('delete', auth()->user());

        $user->delete();
        return redirect()->route('admin.index');
    }
}

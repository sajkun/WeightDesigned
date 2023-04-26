<?php
namespace App\Http\Controllers\Admin\Organisation;

use App\Models\User;
use App\Models\Organisation;
use App\Http\Controllers\Controller;

class DestroyController extends Controller
{
    /**
     * Handle the orgamnisation delete request.
     *
     * @param  \ App\Models\Organisation  $organisation
     * @return \redirect
     */
    public function __invoke(Organisation $organisation)
    {
        // $this->authorize('delete', $organisation);

        $users = User::where('organisation_id', $organisation->id)->delete();
        $organisation->delete();

        return redirect()->route('admin.index');
    }
}

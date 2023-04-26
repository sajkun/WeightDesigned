<?php
namespace App\Http\Controllers\Admin\Organisation;

use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Http\Controllers\Admin\AdminController;

class UpdateController extends AdminController
{
    /**
     * Handle the incoming request.
     *
     * @param  \App\Models\Organisation  $organisation
     */
    public function __invoke(Organisation $organisation, Request $request)
    {
        $this->authorize('update', $organisation);
        $data = $request->validate([
            'name' => 'bail|string',
            'tax_number' => 'string',
            'subscription' => '',
        ]);

        $organisation->update($data);

        return redirect()->route('admin.organisation.edit', $organisation->id);
    }
}

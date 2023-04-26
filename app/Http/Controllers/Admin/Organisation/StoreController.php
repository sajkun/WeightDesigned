<?php
namespace App\Http\Controllers\Admin\Organisation;

use App\Models\Organisation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class StoreController extends Controller
{
    /**
     * Handle the create organisation request.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function __invoke(Request $request)
    {
        // $this->authorize('store', Organisation::class);

        $data = $request->validate([
            'name' => 'bail|string|unique:organisations',
            'tax_number' => 'string|unique:organisations',
            'subscription' => '',
        ]);

        Organisation::create($data);
        return redirect()->route('admin.index');
    }
}

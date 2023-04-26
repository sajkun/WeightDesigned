<?php
namespace App\Http\Controllers\Admin\User;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Admin\AdminController;

class StoreController extends AdminController
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $this->authorize('store', $request->user());

        $validate_conditions = [
            'first_name' => '',
            'last_name' => '',
            'role' => 'required',
            'login' => 'string|unique:users',
            'password' => 'required'
        ];

        $validate_conditions['organisation_id'] = in_array($request['role'], config('users.customer_roles')) ? 'required' : '';

        $data = $request->validate($validate_conditions);

        $data['password'] = Hash::make($data['password']);

        User::create($data);

        return redirect()->route('admin.user.index');
    }
}

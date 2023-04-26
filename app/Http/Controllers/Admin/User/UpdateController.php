<?php
namespace App\Http\Controllers\Admin\User;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Admin\AdminController;

class UpdateController extends AdminController
{
    /**
     * Handle the incoming request.

     */
    public function __invoke(User $user, Request $request)
    {
        $this->authorize('update', $request->user());

        $validate_conditions = [
            'first_name' => '',
            'last_name' => '',
            'role' => 'required',
            'login' => 'string|unique:users',
            'password' => ''
        ];

        foreach (array_keys($validate_conditions) as $key) {
            if ($user[$key] === $request[$key]) {
                unset($request[$key]);
                $validate_conditions[$key] = '';
            }
        }
        $skip_change_role = false;

        if ($user['role'] === config('users.superadmin')) {
            $superadmins = User::where('role', config('users.superadmin'))->get();
            $skip_change_role = $superadmins->count() <= 1 ? true : $skip_change_role ;
        }

        if ($skip_change_role) {
            unset($request['role']);
        }

        $validate_conditions['organisation_id'] = isset($request['role']) && in_array($request['role'], $this->customerUsers) ? 'required' : '';

        $data = $request->validate($validate_conditions);

        if (isset($request['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('admin.user.edit', $user->id);
    }
}

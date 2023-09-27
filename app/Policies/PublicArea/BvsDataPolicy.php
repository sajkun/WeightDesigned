<?php
namespace App\Policies\PublicArea;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BvsDataPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @param  $organisation_id int
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user, $organisation_id)
    {
        return in_array($user->role, ['user_director', 'user_control_employees', 'user_control']) && $user->organisation_id === (int)$organisation_id;
    }
}

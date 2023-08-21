<?php
namespace App\Policies\PublicArea;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class VehiclePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        return in_array($user->role, ['user_director', 'user_control_vehicles', 'user_control']);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     *  @param  $organisation_id int
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, $organisation_id)
    {
        return in_array($user->role, ['user_director', 'user_control_vehicles', 'user_control']) && $user->organisation_id === (int)$organisation_id;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @param  $organisation_id int
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user, $organisation_id)
    {
        return in_array($user->role, ['user_control_vehicles', 'user_control']) && $user->organisation_id === (int)$organisation_id;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  $organisation_id int
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, $organisation_id)
    {
        return in_array($user->role, ['user_control_vehicles', 'user_control']) && $user->organisation_id === (int)$organisation_id;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  $organisation_id int
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, $organisation_id)
    {
        return true;
        return in_array($user->role, ['user_control_vehicles', 'user_control']) && $user->organisation_id === (int)$organisation_id;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  $organisation_id int
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, $organisation_id)
    {
        return in_array($user->role, ['user_control_vehicles', 'user_control']) && $user->organisation_id === (int)$organisation_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  $organisation_id int
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, $organisation_id)
    {
        return in_array($user->role, ['user_control_vehicles', 'user_control']) && $user->organisation_id === (int)$organisation_id;
    }
}

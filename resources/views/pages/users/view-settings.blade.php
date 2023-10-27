@can('update', [App\Models\User::class, $organisation_id])
    <div class="p-2" v-if='activeTab=== "settings"'>

        <the-form ref='editUserForm' @exec-submit='patchUser' @cancel-form='activeTab="info"'
            :_structure='editUserFormStructure' v-if='!editPassword'>
            <button class="btn btn-link" type='button' @click='showChangePassword'>Редактировать пароль</button>
        </the-form>

        <the-form ref='editPasswordFrom' v-if='editPassword' @exec-submit='submitPassword' @cancel-form='editPassword=false'
            :_structure='editPasswordFormStructure'>
        </the-form>
    </div>
@endcan

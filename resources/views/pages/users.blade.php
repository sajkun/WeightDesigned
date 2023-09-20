@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-users'>
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionCb' v-on:confirm-msg='confirmActionCb'
            v-on:clear-msg='clearMessages'></messages-component>

        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <div class="row h-100 position-relative">
            <div class="p-3 align-self-start" :class='listClass'
                :style="!editMode ? 'transition: width .15s ease .1s' : ''">

                <div class="d-lg-flex flex-column org-wrapper h-100">
                    @can('create', [App\Models\User::class, $organisation_id])
                        <button class="btn w-100 btn-borders" type="button" @click='addUser()'>Добавить
                            пользователя</button>
                    @endcan
                    <table class="organisation">
                        <tbody>
                            <tr>
                                <th>№</th>
                                <th>Логин</th>
                                <th>ФИО</th>
                                <th>Роль</th>
                            </tr>
                            <tr v-for='user, key in users' :key='"user" + key' @click='editUser(user)'>
                                <td>@{{ key + 1 }}</td>
                                <td title='Логин'>@{{ user.login }}</td>
                                <td title='ФИО'>@{{ user.first_name }} @{{ user.middle_name }} @{{ user.last_name }}</td>
                                <td title='Роль'>@{{ user.role_name }}</td>
                                <td class='text-end'>
                                    @can('delete', [App\Models\User::class, $organisation_id])
                                        <button class='btn' @click.prevent.stop='deleteUser(user)'>
                                            <i class="fa fa-solid fa-trash"></i>
                                        </button>
                                    @endcan
                                </td>
                        </tbody>
                    </table>
                </div>
            </div>

            <Transition name="bounce">
                <div class="col-12 col-lg-6 p-3 org-details" v-show='editMode'>
                    <div class="d-lg-flex flex-column org-wrapper p-3" v-if='showForm'>
                        <the-form ref='createUserForm' :_structure='addUserFormStructure' @exec-submit='storeUser'
                            @cancel='showForm=false; editMode=false'>
                        </the-form>
                    </div>

                    <div class="d-lg-flex flex-column org-wrapper" v-if='!showForm'>
                        <div class="row">
                            <div class="col-8">
                                <h2 class="h6 m-0 p-2">
                                    @{{ roles[editedUser.role] }}
                                    @{{ editedUser.login }}
                                </h2>
                            </div>
                            <div class="col-4 text-end">
                                <button class='btn btn-close' @click.stop='editMode=false'> </button>

                            </div>
                            @include('pages.users.tabs')
                        </div>
                        @include('pages.users.view-info')
                        @include('pages.users.view-settings')
                    </div>
                </div>
            </Transition>

        </div>
    </div>
@endsection

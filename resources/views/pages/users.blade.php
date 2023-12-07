@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-users'>
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionHandler'
            v-on:confirm-msg='confirmActionHandler' v-on:clear-msg='clearMessages'></messages-component>

        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <h2 class="h5 px-3 mt-3" ref='beforeStickyPosition'>Пользователи</h2>

        <div class="row h-100 position-relative">
            <div class="p-sm-3 align-self-start" :class='listClass'
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
                                <td title='ФИО'>@{{ formatName(user.last_name, user.first_name, user.middle_name) }}</td>
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

            <Transition name="fade">
                <div class="col-12 col-lg-6 p-sm-3 org-details" v-show='editMode' ref='observeResize'>
                    <div class="d-lg-flex flex-column org-wrapper p-3" v-if='showForm' :ref='"fixposition"'>
                        <the-form ref='createUserForm' :_structure='addUserFormStructure' @exec-submit='storeUser'
                            @cancel-form='mode="list"'>
                        </the-form>
                    </div>

                    <div class="d-lg-flex flex-column org-wrapper" v-if='!showForm' :ref='"fixposition"'>
                        <div class="row">
                            <div class="col-8">
                                <h2 class="h6 m-0 p-2">
                                    @{{ roles[editedUser.role] }}
                                    @{{ editedUser.login }}
                                </h2>
                            </div>
                            <div class="col-4 text-end">
                                <button class='btn btn-close' @click.stop='mode="list"'> </button>

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

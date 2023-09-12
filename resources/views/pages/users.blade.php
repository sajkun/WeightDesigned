@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-users'>
        <Transition :key='"msg" + key' name="bounce" v-for='msg, key in messages'>
            <div :class="key + '-message'" v-if='msg'>
                @{{ msg }}

                <div class="row" v-if='key==="confirm"'>
                    <div class="col-12 col-md-6 mt-2"><button class="btn btn-borders-grey w-100" @click='cancelConfirmActionCb'
                            type="button">Отмена</button>
                    </div>
                    <div class="col-12 col-md-6 mt-2"><button class="btn btn-borders w-100" type="button"
                            @click='confirmActionCb'>Подтведить</button>
                    </div>
                </div>
                <button class="btn btn-close" type='button' @click='clearMessages()' v-if="key!='confirm'"></button>
            </div>
        </Transition>

        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <input type="hidden" ref="token" value="{{ csrf_token() }}" />
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
                                <td>@{{ user.login }}</td>
                                <td>@{{ user.first_name }} @{{ user.middle_name }} @{{ user.last_name }}</td>
                                <td>@{{ user.role_name }}</td>
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
                        <the-form ref='createUserForm' :_structure='addUserFormStructure' @exec-submit='storeUser'>
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

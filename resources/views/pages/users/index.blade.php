@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-users'>
        <Transition name="bounce" v-for='msg, key in messages'>
            <div :class="key + '-message'" v-if='msg'>
                @{{ msg }}
                <button class="btn btn-close" type='button' @click='msg=null'></button>
            </div>
        </Transition>

        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <input type="hidden" ref="token" value="{{ csrf_token() }}" />
        <div class="row h-100 position-relative">
            <div class="p-3 align-self-start" :class='listClass'
                :style="!editMode ? 'transition: width .15s ease .1s' : ''">
                <div class="d-lg-flex flex-column org-wrapper h-100">
                    <table class="organisation">
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Логин</th>
                                <th>ФИО</th>
                                <th>Роль</th>
                            </tr>

                            <tr v-for='user, key in users' :key='"user" + key' @click='editUser(user)'>
                                <td>@{{ user.id }}</td>
                                <td>@{{ user.login }}</td>
                                <td>@{{ user.first_name }} @{{ user.middle_name }} @{{ user.last_name }}</td>
                                <td>@{{ user.role_name }}</td>
                                <td class='text-end'>
                                    <button class='btn' @click.prevent.stop>
                                        <i class="fa fa-solid fa-trash"></i>
                                    </button>
                                    <button class='btn'>
                                        <i class="fa fa-solid fa-pencil"></i>
                                    </button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
            <Transition name="bounce">
                <div class="col-lg-6 p-3 org-details" v-show='editMode'>
                    <div class="org-wrapper">
                        <header class="org-details__header"><b>@{{ editedUser.login }}</b></header>

                        <form @submit.prevent="pathUser" method='POST'>
                            <div class="row">
                                <input type="hidden" v-model='editedUser.id'>
                                <div class="col-12 mt-2 col-lg-6 form-control-custom ">
                                    <div class="form-control-custom " :class='{ "d-none": editPassword }'>
                                        <input type="text" :class='{ "active": editedUser.first_name }' id='first_name'
                                            required v-model='editedUser.first_name'>

                                        <label for="first_name">Имя </label>
                                    </div>
                                </div>
                                <div class="col-12 mt-2  col-lg-6">
                                    <div class="form-control-custom " :class='{ "d-none": editPassword }'>

                                        <input type="text" :class='{ "active": editedUser.last_name }' id='last_name'
                                            required v-model='editedUser.last_name'>

                                        <label for="last_name">Фамилия </label>
                                    </div>
                                </div>
                                <div class="col-12 mt-2">
                                    <div class="form-control-custom " :class='{ "d-none": editPassword }'>

                                        <input type="text" :class='{ "active": editedUser.middle_name }' id='middle_name'
                                            required v-model='editedUser.middle_name'>

                                        <label for="middle_name">Отчество </label>
                                    </div>
                                </div>
                                <div class="col-12 mt-2  col-lg-6">
                                    <div class="form-control-custom " :class='{ "d-none": editPassword }'>

                                        <input type="text" :class='{ "active": editedUser.email }' id='email'
                                            required v-model='editedUser.email'>

                                        <label for="email">E-mail </label>
                                    </div>
                                </div>
                                <div class="col-12 mt-2  col-lg-6">
                                    <div class="form-control-custom " :class='{ "d-none": editPassword }'>

                                        <input type="text" :class='{ "active": editedUser.phone }' id='phone'
                                            required v-model='editedUser.phone'>

                                        <label for="phone">Телефон</label>
                                    </div>
                                </div>

                                <div class="col-12 mt-2">
                                    <div class="form-control-custom " :class='{ "d-none": editPassword }'>

                                        <select id='role' class='active' v-model='editedUser.role'>
                                            <option v-for='name, key in roles' :key='"role" + key'
                                                :value="key" :selected=' key === editedUser.role'>
                                                @{{ name }} </option>
                                        </select>

                                        <label for="role">Роль</label>
                                    </div>
                                </div>

                                <div class="col-12 ">
                                    <div class='row' v-if='editPassword'>
                                        <div class="col-12">
                                            <div class="form-control-custom ">
                                                <input type="password" :class='{ "active": passwords.old }'
                                                    id='passwordold' v-model='passwords.old'>
                                                <label for="passwordold">Старый пароль</label>
                                            </div>
                                            <div class="form-control-custom mt-2">
                                                <input type="text" :class='{ "active": passwords.new }' id='password'
                                                    v-model='passwords.new'>
                                                <label for="password">Новый пароль</label>
                                            </div>
                                            <button class="btn btn-link" type='button'
                                                @click='generatePassword'>Сгенерировать
                                                пароль</button>
                                        </div>

                                        <div class="col-12 col-lg-6 mt-1">
                                            <button class="w-100 btn btn-borders-grey" type='button'
                                                @click='editPassword=false'>Отмена</button>
                                        </div>
                                        <div class="col-12 col-lg-6 mt-1">
                                            <button class="w-100 btn btn-borders" type='button'
                                                @click='submitPassword'>Сохранить
                                                пароль</button>
                                        </div>
                                    </div>
                                    <button class="btn-link btn" v-if='!editPassword' type='button'
                                        @click='editPassword=true'>Редактировать
                                        пароль</button>
                                </div>

                                <div class="col-12 col-md-6" :class='{ "d-none": editPassword }'>
                                    <button type='button' @click='editMode=false' :disabled='editPassword'
                                        class='w-100 mt-3 btn btn-borders-grey'>
                                        Отмена
                                    </button>
                                </div>
                                <div class="col-12 col-md-6" :class='{ "d-none": editPassword }'>
                                    <button type='submit' :disabled='editPassword'
                                        class='w-100 mt-3 btn  btn-primary-alt'>
                                        Сохранить
                                    </button>
                                </div>

                            </div>

                        </form>
                    </div>
                </div>
            </Transition>

        </div>
    </div>
@endsection

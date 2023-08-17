@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-vehicles'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <Transition :key='"msg" + key' name="bounce" v-for='msg, key in messages'>
            <div :class="key + '-message'" v-if='msg'>
                @{{ msg }}

                <div class="row" v-if='key==="confirm"'>
                    <div class="col-12 col-md-6 mt-2"><button class="btn btn-borders-grey w-100"
                            @click='cancelConfirmActionCb' type="button">Отмена</button>
                    </div>
                    <div class="col-12 col-md-6 mt-2"><button class="btn btn-borders w-100" type="button"
                            @click='confirmActionCb'>Подтведить</button>
                    </div>
                </div>
                <button class="btn btn-close" type='button' @click='clearMessages()' v-if="key!='confirm'"></button>
            </div>
        </Transition>

        <Transition name="fade">
            <div class="row h-100 position-relative" v-if='mode === "list" || mode === "details" '>
                <div class="p-3 align-self-start">

                    <div class="row h-100">
                        <div class='' :class="columnClass.tableClass">
                            <div class="d-lg-flex org-wrapper flex-column h-100">
                                @can('create', [App\Models\Bunker::class, $organisation_id])
                                    <button class="btn w-100 btn-borders" type="button" @click='addVehicle("bunkers")'>Добавить
                                        Бункер Перегрузчик</button>
                                @endcan
                                <table class="organisation mt-3">
                                    <tbody>
                                        <tr>
                                            <th>№</th>
                                            <th>Название</th>
                                            <th>Модель</th>
                                            <th>Ответственный</th>
                                        </tr>

                                        <tr v-for='item, key in vehicles.bunkers' :key='"vehicklerow" + key'
                                            @click='viewVehicle(item)'>
                                            <td>@{{ key }}</td>
                                            <td>@{{ item.name }}</td>
                                            <td>@{{ item.model }}</td>
                                            <td>@{{ item.employee_name }}</td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        <div class="col-12 col-md-6" v-if='mode === "details" '>
                            <div class="org-wrapper">
                                <div class="row ">
                                    <h2 class="h4 m-0">
                                        Бункер Перегрузчик @{{ editedVehicle.name }}
                                    </h2>
                                    <nav class="tabs mt-2">
                                        <div class="row">
                                            <ul>
                                                <li>
                                                    <button class="btn  btn-tab" :class="{ 'active': activeTab === 'info' }"
                                                        @click="activeTab = 'info'" type='button'>Информация</button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-tab"
                                                        :class="{ 'active': activeTab === 'activity' }"
                                                        @click="activeTab = 'activity'" type='button'>Активность</button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-tab"
                                                        :class="{ 'active': activeTab === 'settings' }"
                                                        @click="activeTab = 'settings'" type='button'>Настройки</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </nav>
                                </div>

                                <div class="" v-if='activeTab=== "info"'>
                                    <div class="row mt-2">
                                        <div class="col-12 col-md-6 mt-2">
                                            <h4 class="m-0 label">Модель</h4>
                                            <p class="mt-1">@{{ editedVehicle.model }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="h-100 position-relative" v-if='mode=== "create"'>
                @can('create', [App\Models\Bunker::class, $organisation_id])
                    @include('pages.vehicles.create')
                @endcan
            </div>
        </Transition>

        <Transition name="fade">
            @include('pages.vehicles.employees-popup')
        </Transition>
    </div>
@endsection

@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-vehicles'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <input type="hidden" ref='vehicleType' value='{{ $type }}'>
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
                                @can('create', [App\Models\Vehicle::class, $organisation_id])
                                    <button class="btn w-100 btn-borders" type="button"
                                        @click='addVehicle("{{ $type }}")'>Добавить
                                        @{{ vehicleName }}</button>
                                @endcan
                                <table class="organisation mt-3">
                                    <tbody>
                                        <tr>
                                            <th>№</th>
                                            <th>Название</th>
                                            <th>Модель</th>
                                            <th>Ответственный</th>
                                            <th></th>
                                        </tr>

                                        <tr v-for='item, key in vehiclesCurrent' :key='"vehicklerow" + key'
                                            @click='viewVehicle(item)'>
                                            <td>@{{ key }}</td>
                                            <td>@{{ item.name }}</td>
                                            <td>@{{ item.model }}</td>
                                            <td>@{{ item.employee_name }}</td>
                                            <th width='100' class='text-end'>
                                                @can('delete', [App\Models\Vehicle::class, $organisation_id])
                                                    <button class='btn p-1' @click.prevent.stop='deleteVehicle(item)'>
                                                        <i class="fa fa-solid fa-trash"></i>
                                                    </button>
                                                @endcan

                                            </th>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>

                        <div class="col-12 col-md-6" v-if='mode === "details" '>
                            <div class="org-wrapper">
                                <div class="row ">
                                    <div class="col-10">
                                        <h2 class="h4 m-0">
                                            @{{ vehicleName }} @{{ editedVehicle.name }}
                                        </h2>
                                    </div>
                                    <div class="col text-end">
                                        <button class="btn p-0  btn-close" type='button' @click='mode="list"'>
                                        </button>
                                    </div>
                                </div>

                                <div class="row">
                                    @include('pages.vehicles.view-tabs')
                                </div>

                                @include('pages.vehicles.view-details')

                                @include('pages.vehicles.view-activity')

                                @can('update', [App\Models\Vehicle::class, $organisation_id])
                                    @include('pages.vehicles.view-settings')
                                @endcan

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="h-100 position-relative" v-if='mode=== "create"'>
                @can('create', [App\Models\Vehicle::class, $organisation_id])
                    @include('pages.vehicles.create')
                @endcan
            </div>
        </Transition>

        <Transition name="fade">
            @include('pages.vehicles.employees-popup')
        </Transition>

        <Transition name="fade">
            @include('pages.vehicles.rfids-popup')
        </Transition>

        <Transition name="fade">
            @include('pages.vehicles.vehicles-popup')
        </Transition>
    </div>
@endsection

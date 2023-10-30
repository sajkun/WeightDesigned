@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-vehicles'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <input type="hidden" ref='vehicleType' value='{{ $type }}'>

        {{-- Компонент сообщений --}}
        {{-- ********************** --}}
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionHandler'
            v-on:confirm-msg='confirmActionHandler' v-on:clear-msg='clearMessages'></messages-component>
        {{-- ********************** --}}

        <h2 class="h5 px-3 mt-3" ref='beforeStickyPosition'>Техника</h2>

        <div class="row h-100 position-relative" v-if='mode === "list" || mode === "details" '>
            <div class="px-3 align-self-start">

                <div class="row h-100 ">
                    <div class='py-3' :class="columnClass.tableClass">
                        <div class="d-lg-flex org-wrapper flex-column ">
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
                                        <td>@{{ key + 1 }}</td>
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

                    <Transition name='fade'>
                        <div class="col-12 col-md-6 py-3" v-show='mode === "details" ' ref='observeResize'>
                            <div class="org-wrapper" :ref='"fixposition"'>
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
                    </Transition>

                </div>
            </div>
        </div>

        <div class="h-100 position-relative" v-if='mode=== "create"'>
            @can('create', [App\Models\Vehicle::class, $organisation_id])
                @include('pages.vehicles.create')
            @endcan
        </div>

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

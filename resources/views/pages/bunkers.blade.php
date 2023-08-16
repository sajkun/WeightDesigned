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
            <div class="row h-100 position-relative" v-if='mode=== "list"'>
                <div class="p-3 align-self-start">
                    <div class="d-lg-flex flex-column org-wrapper h-100">
                        @can('create', [App\Models\Bunker::class, $organisation_id])
                            <button class="btn w-100 btn-borders" type="button" @click='addVehicle("bunkers")'>Добавить
                                Бункер Перегрузчик</button>
                        @endcan
                        <table class="organisation mt-3">
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Модель</th>
                                    <th>Ответственный</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="h-100 position-relative" v-if='mode=== "create"'>
                @include('pages.vehicles.create')
            </div>
        </Transition>

        <Transition name="fade">
            @include('pages.vehicles.employees-popup')
        </Transition>
    </div>
@endsection

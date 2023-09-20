@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-employees'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionCb' v-on:confrim-msg='confirmActionCb'
            v-on:clear-msg='clearMessages'></messages-component>
        <div class="row h-100 position-relative">
            <div class="p-3 align-self-start" :class='listClass'
                :style="!editMode ? 'transition: width .15s ease .1s' : ''">

                <div class="d-lg-flex flex-column org-wrapper h-100">
                    @can('create', [App\Models\Employee::class, $organisation_id])
                        <button class="btn w-100 btn-borders" type="button" @click='addEmployee()'>Добавить
                            Сотрудника</button>
                    @endcan
                    <table class="organisation mt-3">
                        <tbody>
                            <tr>
                                <th>№</th>
                                <th>ФИО</th>
                                <th>Телефон</th>
                                <th>Профессия</th>
                                <td></td>
                            </tr>
                            <tr v-for='person, key in employees' :key='"emp" + key' @click.stop='edit(person, false )'>
                                <td>@{{ key + 1 }}</td>
                                <td title='ФИО'>@{{ person.first_name }} @{{ person.middle_name }} @{{ person.last_name }}</td>
                                <td title='Телефон'>@{{ person.phone }}</td>
                                <td title='Профессия'>@{{ person.specialisation }}</td>
                                <td class='text-end'>
                                    @can('delete', [App\Models\Employee::class, $organisation_id])
                                        <button class='btn' @click.prevent.stop='deleteEmployee(person)'>
                                            <i class="fa fa-solid fa-trash"></i>
                                        </button>
                                    @endcan
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <Transition name="bounce">
                <div class="col-12 col-lg-6 p-3 org-details" v-show='editMode'>
                    <div class="d-lg-flex flex-column org-wrapper h-100" v-if='showForm'>
                        <form @submit.prevent="submitForm" method='POST'>
                            <div class="row">
                                <div class="col-12 mt-2 col-lg-6 form-control-custom ">
                                    <div class="form-control-custom ">
                                        <input type="text" autocomplete='off'
                                            :class='{ "active": editedEmployee.first_name }' id='first_name' required
                                            v-model='editedEmployee.first_name'>

                                        <label for="first_name">Имя </label>
                                    </div>
                                </div>
                                <div class="col-12 mt-2  col-lg-6">
                                    <div class="form-control-custom ">
                                        <input type="text" autocomplete='off'
                                            :class='{ "active": editedEmployee.middle_name }' id='middle_name'
                                            v-model='editedEmployee.middle_name'>

                                        <label for="middle_name">Отчество </label>
                                    </div>
                                </div>
                                <div class="col-12 mt-2">
                                    <div class="form-control-custom ">
                                        <input type="text" autocomplete='off'
                                            :class='{ "active": editedEmployee.last_name }' id='last_name' required
                                            v-model='editedEmployee.last_name'>

                                        <label for="last_name">Фамилия </label>
                                    </div>
                                </div>
                                <div class="col-12 mt-2">
                                    <div class="form-control-custom ">

                                        <input type="text" autocomplete='off' :class='{ "active": editedEmployee.phone }'
                                            id='phone' required v-model='editedEmployee.phone'>
                                        <label for="phone">Телефон</label>
                                    </div>
                                </div>
                                <div class="col-12 mt-2">
                                    <div class="form-control-custom ">
                                        <select id='specialisation' required
                                            :class='{ "active": editedEmployee.specialisation }'v-model='editedEmployee.specialisation'>
                                            <option v-for='name, key in specialisations' :key='"specialisation" + key'
                                                :value="key" :selected=' key === editedEmployee.specialisation'>
                                                @{{ name }} </option>
                                        </select>

                                        <label for="specialisation">Профессия</label>
                                    </div>
                                </div>
                            </div>

                            <div class="row">

                                <div class="col-12 col-md-6">
                                    <button type='button' @click='editMode=false' v-if="editedEmployee.id < 0"
                                        class='w-100 mt-3 btn btn-borders-grey'>
                                        Отмена
                                    </button>
                                    <button type='button' @click='showForm=false' v-if="editedEmployee.id >= 0"
                                        class='w-100 mt-3 btn btn-borders-grey'>
                                        Отмена
                                    </button>
                                </div>
                                <div class="col-12 col-md-6">
                                    <button type='submit' class='w-100 mt-3 btn  btn-primary-alt'>
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="d-lg-flex flex-column org-wrapper h-100" v-if='!showForm'>
                        <button class="btn toggle-expand">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5 5V8.81818M5 5H8.81818M5 5L9.45455 9.45455M5 19V15.1818M5 19H8.81818M5 19L9.45455 14.5455M19 5L15.1818 5M19 5V8.81818M19 5L14.5455 9.45455M19 19H15.1818M19 19V15.1818M19 19L14.5455 14.5455"
                                    stroke="#007E3C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </button>
                        <div class="row">
                            <h2 class="h4 m-0">
                                @{{ editedEmployee.first_name }}
                                @{{ editedEmployee.middle_name }}
                                @{{ editedEmployee.last_name }}

                                <button class='btn btn-close' @click.stop='editMode=false'> </button>
                            </h2>
                            @include('pages.employees.tabs')
                        </div>
                        @include('pages.employees.view-info')
                        @include('pages.employees.view-settings')

                    </div>
                </div>
            </Transition>
        </div>
        <Transition name="fade">
            @include('pages.employees.vehicles-popup')
        </Transition>
    </div>
@endsection

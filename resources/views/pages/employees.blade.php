@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-employees'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>

        {{-- Компонент сообщений --}}
        {{-- ********************** --}}
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionHandler'
            v-on:confirm-msg='confirmActionHandler' v-on:clear-msg='clearMessages'></messages-component>
        {{-- ********************** --}}
        <h2 class="h5 px-3 mt-3" ref='beforeStickyPosition'>Сотрудники</h2>

        <div class="row h-100 position-relative">
            {{-- Таблица со списком работников --}}
            {{-- ********************** --}}
            <div class="p-sm-3 align-self-start" :class='listClass'
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
                            <tr v-for='person, key in employees' :key='"emp" + key' @click='edit(person, false )'>
                                <td>@{{ key + 1 }}</td>
                                <td title='ФИО'>@{{ formatName(person.last_name, person.first_name, person.middle_name) }}</td>
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
            {{-- ********************** --}}
            {{-- конец таблицы со списком работников --}}

            {{-- Данные о сотруднике и форма добавления нового сотрудника --}}
            {{-- ********************** --}}
            <Transition name="fade">
                <div class="col-12 col-lg-6 p-sm-3 org-details" v-show='editMode' ref='observeResize'>

                    {{-- Форма добавления нового сотрудника --}}
                    {{-- ********************** --}}
                    <div class="d-lg-flex flex-column org-wrapper  p-4" v-if='showForm' :ref='"fixposition"'>
                        <h3 class="h4">Добавить нового сотрудника</h3>
                        <the-form ref='createEmployeeForm' :_structure='addEmployeeFormStructure'
                            @exec-submit='storeEmployee' @cancel-form='showForm=false; editMode=false'>
                        </the-form>

                    </div>
                    {{-- ********************** --}}
                    {{--  Конец Форма добавления нового сотрудника --}}

                    {{-- Данные о выбранном сотруднике --}}
                    {{-- ********************** --}}
                    <div class="d-lg-flex flex-column org-wrapper p-4" v-if='!showForm' :ref='"fixposition"'>
                        <div class="row">
                            <div class="col">
                                <h2 class="h4 m-0">
                                    @{{ editedEmployee.first_name }}
                                    @{{ editedEmployee.middle_name }}
                                    @{{ editedEmployee.last_name }}
                                </h2>
                            </div>
                            <div class="col text-end">
                                <button class='btn btn-close' @click.stop='editMode=false'> </button>
                            </div>
                        </div>
                        <div class="row">
                            @include('pages.employees.tabs')
                        </div>
                        @include('pages.employees.view-info')
                        @include('pages.employees.view-settings')
                    </div>
                    {{-- ********************** --}}
                    {{-- Конец Данных о выбранном сотруднике --}}
                </div>
            </Transition>
            {{-- ********************** --}}
            {{-- Конец Данные о сотруднике и форма добавления нового сотрудника --}}
        </div>

        {{-- Высплывающее окно для выбора техники и назначения сотрудника ответственным --}}
        <Transition name="fade">
            @include('pages.employees.vehicles-popup')
        </Transition>
    </div>
@endsection

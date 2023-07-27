@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none" id='public-employees'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>


        <div class="row h-100 position-relative">
            <div class="p-3 align-self-start" :class='listClass'
                :style="!editMode ? 'transition: width .15s ease .1s' : ''">

                <div class="d-lg-flex flex-column org-wrapper h-100">
                    <button class="btn w-100 btn-borders" type="button" @click='addEmployee()'>Добавить
                        Сотрудника</button>
                    <table class="organisation">
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th>ФИО</th>
                                <th>Профессия</th>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <Transition name="bounce">
                <div class="col-12 col-lg-6 p-3 org-details" v-show='editMode'>
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
                                    <input type="text" autocomplete='off' :class='{ "active": editedEmployee.last_name }'
                                        id='last_name' required v-model='editedEmployee.last_name'>

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

                                    <select id='specialisation'
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
                                <button type='button' @click='editMode=false' class='w-100 mt-3 btn btn-borders-grey'>
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
            </Transition>
        </div>
    </div>
@endsection

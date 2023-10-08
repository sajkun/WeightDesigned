@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none h-100" id='public-statistics'>
        {{-- данные об id пользователя и организации для приложения VUE --}}
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>

        {{-- компонент отображения сообщений  --}}
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionCb' v-on:confirm-msg='confirmActionCb'
            v-on:clear-msg='clearMessages'></messages-component>

        <div class="row mt-4">
            <div class="col-6">
                <p class="m-0 h-6 d-inline">Рейтинг среди:</p>
                <select v-model='ratingBy' class='ms-2  inline-select'>
                    <option v-for='rate, key in ratingOptions' :key='"options" + key' :value='key'>
                        @{{ rate }}</option>
                </select>
            </div>
            <div class="col-6 text-end"></div>
        </div>
    </div>
@endsection

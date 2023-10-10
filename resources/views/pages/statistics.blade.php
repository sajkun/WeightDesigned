{{-- Страница статистики --}}
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
            <div class="col-6 align-self-center">
                <p class="m-0 h-6 d-inline">Рейтинг среди:</p>
                <select v-model='ratingBy' class='ms-2  inline-select'>
                    <option v-for='rate, key in ratingOptions' :key='"options" + key' :value='key' :disabled="(key === '-')">
                        @{{ rate }}</option>
                </select>
            </div>
            <div class="col-6 text-end">
                <month-picker @selected='setDisplayedPeriod'/>
            </div>
        </div>

        <div class="row">
            <div class="col-12 col-md-6">
                <div class='rating-row' :class="'rating'+(key+1)" v-for='data, key in ratingData' :key='"bvsdata" + key'>
                    <div class='d-flex'>
                        <div class="flex-shrink-1 me-2">
                            <i class="fa fa-star"></i>
                        </div>
                        <div class="flex-shrink-1 me-4">
                                @{{key+1}}
                        </div>
                        <div class="col-4">
                            @{{data.name}}
                        </div>
                        <div class="col-5">
                            @{{data.type}}
                        </div>
                        <div class="col text-end">
                            @{{data.amount}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6"></div>
        </div>
    </div>
@endsection

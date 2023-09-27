@extends('layouts.public')

@section('content')
    <div class="container-fluid d-flex flex-grow-1 flex-column" id='home-page'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        {{-- компонент отображения сообщений  --}}
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionCb' v-on:confirm-msg='confirmActionCb'
            v-on:clear-msg='clearMessages'></messages-component>

        <div class="row flex-grow-1 ">
            {{-- НАЧАЛО БЛОКА выбора периода отображения  --}}
            <div class="col-12 col-md-6 py-4 ">

                {{-- компонент отображения кнопок выбора периода --}}
                <switcher-component :_buttons="modes" :_active-mode='mode' @clicked='changeMode'>
                </switcher-component>
                <div class="mt-4"></div>

                {{-- компонент Календарь --}}
                <calendar :_initial-date='"2023-10-25"' :_disabled='calendarState' :_select-period='selectPeriod'
                    @selected-date='selectDateCb' @selected-period='selectPeriodCb'>
                </calendar>
            </div>
            {{--  КОНЕЦ БЛОКА выбора периода отображения  --}}

            {{-- НАЧАЛО БЛОКА карты  --}}
            <div class="col-12 col-md-6">
                <div class="py-4 h-100 w-100">
                    {{-- контейнер для Яндекс карты --}}
                    <div class="h-100 w-100" id="map"></div>
                </div>
            </div>
            {{-- КОНЕЦ БЛОКА карты  --}}
        </div>
    </div>
@endsection

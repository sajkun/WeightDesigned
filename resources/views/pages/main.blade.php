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
            <div class="col-12 col-md-6 py-4" v-if='display==="calendar"'>

                {{-- компонент отображения кнопок выбора периода --}}
                <switcher-component :_buttons="modes" :_active-mode='mode' @clicked='changeMode'>
                </switcher-component>
                <div class="mt-4"></div>

                {{-- компонент Календарь --}}
                <calendar :_initial-date='today' :_disabled='calendarState' :_period="period"
                    :_select-period='selectPeriod' @selected-date='selectDateCb' @selected-period='selectPeriodCb'>
                </calendar>

                {{-- кпопка перехода к режиму просмотра в разрезе БВС --}}
                <div class="div" v-if='bvsDataFiltered.length'>
                    <button class="btn btn-primary-alt w-100 text-center mt-4" type='button'
                        @click='changeDisplay("list")'>Продолжить</button>
                </div>
            </div>
            {{--  КОНЕЦ БЛОКА выбора периода отображения  --}}

            {{-- НАЧАЛО БЛОКА  отображения списка БВС  --}}
            <div class="col-12 col-md-6 py-4" v-if='display==="list"'>

                {{-- превью с данными БВС  --}}
                <bvs-short-component @select='selectBvsCb' v-for='bvs, key in bsvFilteredByUnit' :key='"key" + bvs'
                    :_bvs='bvs'></bvs-short-component>

                {{-- Кнопка перехода к режиму просмотра отдельных транзакций бвс --}}
                <div class="div" v-if='selectedBvs.length > 0'>
                    <button class="btn btn-primary-alt w-100 text-center mt-4" type='button'
                        @click='changeDisplay("items")'>Продолжить</button>
                </div>
            </div>
            {{--  КОНЕЦ БЛОКА отображения списка БВС --}}


            {{-- НАЧАЛО БЛОКА  отображения списка операций --}}
            <div class="col-12 col-md-6 py-4" v-if='display==="items"'>
                <button class="btn btn-primary-alt w-100 text-center mt-4" type='button'
                    @click='changeDisplay("calendar")'>Выбрать другие даты</button>
                {{-- операции БВС --}}
                <bvs-operation :_info='info' :key='"operation" + key' v-for='info,key in bvsOperations'
                    :class='"mt-4"'>
                </bvs-operation>

                <div class="div">
                    <button class="btn btn-primary-alt w-100 text-center mt-4" type='button'
                        @click='changeDisplay("calendar")'>Выбрать другие даты</button>
                </div>
            </div>
            {{--  КОНЕЦ БЛОКА отображения списка операций --}}

            {{-- НАЧАЛО БЛОКА карты  --}}
            <div class="col-12 col-md-6">
                <div class="py-4 h-100 w-100">
                    {{-- контейнер для Яндекс карты --}}
                    <bvs-map :_id='"map"' :_bvs-data='bvsOperations'></bvs-map>
                </div>
            </div>
            {{-- КОНЕЦ БЛОКА карты  --}}
        </div>
    </div>
@endsection

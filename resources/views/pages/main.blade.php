{{-- @deprecated --}}
@extends('layouts.public')

@section('content')
    <div class="container-fluid d-flex flex-grow-1 flex-column" id='home-page'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <div class="row flex-grow-1 ">
            <div class="col-12 col-md-6">
                {{-- НАЧАЛО БЛОКА выбора периода отображения  --}}
                <div class="px-1 py-2">
                    {{-- компонент отображения кнопок выбора периода --}}
                    <switcher-component :_buttons="modes" :_active-mode='mode' @clicked='changeMode'>
                    </switcher-component>
                </div>
                <div class="px-1 py-2" v-if='display==="calendar"'>
                    {{-- компонент Календарь --}}
                    <calendar :_initial-date='today' :_disabled='calendarState' :_period="period"
                        :_select-period='selectPeriod' :_marked-days="markedDays" @selected-date='selectDateCb'
                        @selected-period='selectPeriodCb'>
                    </calendar>

                    {{-- кпопка перехода к режиму просмотра в разрезе БВС --}}
                    <div class="div" v-if='bvsDataFiltered.length'>
                        <button class="btn btn-primary-alt w-100 text-center mt-2" type='button'
                            @click='changeDisplay("list")'>Продолжить</button>
                    </div>
                </div>
                {{--  КОНЕЦ БЛОКА выбора периода отображения  --}}

                {{-- НАЧАЛО БЛОКА  отображения списка БВС  --}}
                <div class="py-2  px-1" v-if='display==="list"'>

                    <button class="btn btn-primary-alt w-100 text-center mb-1" type='button' v-if='mode!== "all"'
                        @click='changeDisplay("calendar")'>Выбрать другие даты</button>

                    {{-- превью с данными БВС  --}}
                    <bvs-short-component @select='selectBvsCb' v-for='bvs, key in bsvFilteredByUnit' :key='"key" + bvs'
                        class='mt-2' :_bvs='bvs'></bvs-short-component>

                    {{-- Кнопка перехода к режиму просмотра отдельных транзакций бвс --}}
                    <div class="div" v-if='selectedBvs.length > 0'>
                        <button class="btn btn-primary-alt w-100 text-center mt-2" type='button'
                            @click='changeDisplay("items")'>Продолжить</button>
                    </div>
                </div>
                {{--  КОНЕЦ БЛОКА отображения списка БВС --}}

                {{-- НАЧАЛО БЛОКА  отображения списка операций --}}
                <div class="py-2" v-if='display==="items"'>
                    <button class="btn btn-primary-alt w-100 text-center mt-2" type='button' v-if='mode!== "all"'
                        @click='changeDisplay("calendar")'>Выбрать другие даты</button>
                    <button class="btn btn-primary-alt w-100 text-center mt-2" type='button' v-if='mode === "all"'
                        @click='changeDisplay("list")'>Выбрать другие БВС</button>
                    {{-- операции БВС --}}
                    <bvs-operation :_info='info' :key='"operation" + key' v-for='info,key in bvsOperations'
                        :class='"mt-2"' @selected='selectOperationCb'>
                    </bvs-operation>

                    <div class="div">
                        <button class="btn btn-primary-alt w-100 text-center mt-2" type='button' v-if='mode!== "all"'
                            @click='changeDisplay("calendar")'>Выбрать другие даты</button>

                        <button class="btn btn-primary-alt w-100 text-center mt-2" type='button' v-if='mode === "all"'
                            @click='changeDisplay("list")'>Выбрать другие БВС</button>
                    </div>
                </div>
                {{--  КОНЕЦ БЛОКА отображения списка операций --}}
            </div>

            {{-- НАЧАЛО БЛОКА карты  --}}
            <div class="col-12 col-md-6" v-show='showMap' ref='observeResize'>
                <div class="pt-2 pb-4 h-100 w-100" :ref='"fixposition"'>
                    {{-- контейнер для Яндекс карты --}}
                    <bvs-map :_id='"map"' :_bvs-data='bvsFilteredByOperations'
                        :_grasslands-data='grasslandsData'></bvs-map>
                </div>
            </div>
            {{-- КОНЕЦ БЛОКА карты  --}}
        </div>
    </div>
@endsection

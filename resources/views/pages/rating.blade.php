{{-- Страница ретинга --}}
@extends('layouts.public')

@section('content')
    <div class="container-xl d-none h-100 flex-column pb-4" id='public-rating'>
        {{-- данные об id пользователя и организации для приложения VUE --}}
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        {{-- ************************************************ --}}

        {{-- компонент отображения сообщений  --}}
        {{-- ************************************************ --}}
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionHandler'
            v-on:confirm-msg='confirmActionHandler' v-on:clear-msg='clearMessages'></messages-component>
        {{-- ************************************************ --}}

        {{-- шапка со списком выбора вариантов сортировки и выбора месяца или года отображения --}}
        {{-- ************************************************ --}}
        <div class="row mt-4 mb-2 justify-content-between" ref='beforeStickyPosition'>
            <div class="col-md-auto col-12 align-self-center">
                <p class="m-0 h-6 d-inline">Рейтинг среди:</p>
                <select v-model='ratingBy' class='ms-2  inline-select'>
                    <option v-for='rate, key in ratingOptions' :key='"options" + key' :value='key'
                        :disabled="(key === '-')">
                        @{{ rate }}</option>
                </select>
            </div>
            <div class="col-md-4 col-12 text-md-end mt-4 mt-0-md">
                <month-picker @selected='setDisplayedPeriod' />
            </div>
        </div>
        {{-- ************************************************ --}}
        <div class="row flex-grow-1">
            {{-- Список отфильтрованных данных --}}
            {{-- ************************************************ --}}
            <div class='col-12 col-md-6 col-xl-7 rating-list' v-show='ratingData.length'>
                <transition-group :css="false" name='sort'>
                    <div v-for='data, key in ratingData' :data-index='key' :key='data.pid'>
                        <div class='rating-row' :class="'rating' + (key + 1)">
                            <div class='d-flex'>
                                <div class="flex-shrink-1 me-2">
                                    <i class="fa fa-star"></i>
                                </div>
                                <div class="flex-shrink-0 rating-row__number-cell me-4">
                                    @{{ key + 1 }}
                                </div>
                                <div class="col-4">
                                    @{{ data.name }}
                                </div>
                                <div class="col-5">
                                    @{{ data.type }}
                                </div>
                                <div class="col text-end">
                                    @{{ data.amount }}
                                </div>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
            {{-- ************************************************ --}}
            <div class="col-12 col-md-6 col-xl-7 mt-4 rating-nolist" v-if='!ratingData.length'>
                <i>Нет записей </i>
            </div>
            <div class="col-12 col-md-6 col-xl-5 d-flex flex-column" ref='observeResize'>
                <div class="w-100 flex-grow-1" :ref='"fixposition"'>
                    <Columns :_info='ratingData' :_max-value='ratingMaxValue'></Columns>
                </div>
            </div>
        </div>
    </div>
@endsection

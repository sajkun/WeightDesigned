{{-- Страница статистики публичного раздела --}}
@extends('layouts.public')

@section('content')
    <div class="container-xl d-none h-100 flex-column pb-4" id='public-statistics'>
        {{-- данные об id пользователя и организации для приложения VUE --}}
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        {{-- ************************************************ --}}

        {{-- компонент отображения сообщений  --}}
        {{-- ************************************************ --}}
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionCb' v-on:confirm-msg='confirmActionCb'
            v-on:clear-msg='clearMessages'></messages-component>
        {{-- ************************************************ --}}

        {{-- шапка со списком выбора вариантов сортировки и выбора месяца или года отображения --}}
        {{-- ************************************************ --}}
        <div class="mt-4 mb-2 statistics-header">
            <div class="row align-items-center">
                <div class="col-auto">
                    <p class="m-0 h-6 d-inline">Статистика:</p>
                    <select v-model='ratingBy' :size='ratingBy' class='ms-2  inline-select'>
                        <option v-for='rate, key in ratingOptions' :key='"options" + key' :value='key'
                            :disabled="(key === '-')">
                            @{{ rate }}</option>
                    </select>
                </div>
                <div class="col-auto d-flex align-items-center">
                    <span class="label">с </span>
                    <datepicker class='ms-2' :_date='dateRange.start' @date-changed='setDate("start", $event)' />
                </div>
                <div class="col-auto d-flex align-items-center">
                    <span class="label">
                        по </span>
                    <datepicker :_date='dateRange.end' class='ms-2' @date-changed='setDate("end", $event)' />
                </div>
                <div class="col-auto">
                    <button class="btn btn-sm btn-primary-alt" type='button' @click='setPeriod("month")'>Месяц</button>
                    <button class="btn btn-sm btn-primary-alt ms-2" type='button'
                        @click='setPeriod("quarter")'>Квартал</button>
                    <button class="btn btn-sm btn-primary-alt ms-2" type='button' @click='setPeriod("year")'>Год</button>
                </div>

            </div>
        </div>
        {{-- ************************************************ --}}

        {{-- заголовок с выбором периода --}}
        {{-- ************************************************ --}}
        <div class="row flex-grow-1">
            {{-- Список отфильтрованных данных --}}
            {{-- ************************************************ --}}
            <Transition name='fade'>
                <div class='col-12 col-md-6 statistics-list' v-show='ratingData.length'>
                    <transition-group :css="false" v-on:before-enter="onBeforeEnter" v-on:enter="onEnter"
                        v-on:leave="onLeave" name='sort'>
                        <div v-for='data, key in ratingData' :data-index='key' :key='data.pid'>
                            <div class='statistics-row' :class="'statistics' + (key + 1)">
                                <div class='d-flex'>
                                    <div class="flex-shrink-0 statistics-row__number-cell me-4">
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
            </Transition>
            {{-- ************************************************ --}}

            {{-- аналитические данные об урожает в выбранный период --}}
            {{-- ************************************************ --}}
            <Transition name='fade'>
                <div class="col-12 col-md-6" v-show='ratingData.length'>
                    <div class="d-flex flex-column h-100 statistics-details p-4">

                        {{-- Ряд с данными:
                         - собрано урожая,
                         - всего рабочих дней,
                         - лучший сбор за день
                        --}}
                        {{-- ************************************************ --}}
                        <div class="row">
                            <div class="col-12 col-md-4">
                                <div class="statistics-data">
                                    <h3 class="statistics-data__label">Собрано урожая</h3>
                                    <p class="statistics-data__value">
                                        135 т.
                                    </p>
                                </div>
                            </div>
                            <div class="col-12 col-md-4 mt-2 mt-md-0">
                                <div class="statistics-data">
                                    <h3 class="statistics-data__label">Рабочих дней</h3>
                                    <p class="statistics-data__value">
                                        26
                                    </p>
                                </div>
                            </div>
                            <div class="col-12 col-md-4 mt-2 mt-md-0">
                                <div class="statistics-data">
                                    <h3 class="statistics-data__label">Лучший сбор за день</h3>
                                    <p class="statistics-data__value">
                                        30 т.
                                        <span class="statistics-data__value_secondary">18 фев.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {{-- ************************************************ --}}
                        {{-- график динамики уборки  --}}
                        {{-- ************************************************ --}}
                        <div class="flex-grow-1 mt-2 d-flex flex-column">
                            <h3 class="h6 m-0">
                                Динамика уборки урожая за февраль
                            </h3>

                            <div class="graph-body flex-grow-1 mt-4">
                                <Graph :_info='bvsInfo'></Graph>
                            </div>
                        </div>
                        {{-- ************************************************ --}}

                        {{-- 5 лучших за период --}}
                        {{-- ************************************************ --}}
                        <div>
                            <h3 class="h6 m-0">
                                5 лучших бункеров-перегрузчиков за февраль
                            </h3>
                            <div class="row">
                                <div class="col-7">
                                    <div class="statistics-best-item">
                                        <i class="statistics-best-item__icon"></i>
                                        <h4 class="statistics-best-item__name">фамилия имя отчество</h4>
                                        <p class="statistics-best-item__persantage text-end">15%</p>
                                    </div>

                                    <div class="statistics-best-item statistics-best-item_others">
                                        <i class="statistics-best-item__icon"></i>
                                        <h4 class="statistics-best-item__name">остальные(8)</h4>
                                        <p class="statistics-best-item__persantage text-end">45%</p>
                                    </div>
                                </div>
                                <div class="col-5">
                                    <div class="diagram"></div>
                                </div>
                            </div>
                        </div>
                        {{-- ************************************************ --}}
                    </div>
                </div>
            </Transition>
        </div>
    </div>
@endsection

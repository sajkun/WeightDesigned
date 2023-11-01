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
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionHandler'
            v-on:confirm-msg='confirmActionHandler' v-on:clear-msg='clearMessages'></messages-component>
        {{-- ************************************************ --}}

        {{-- шапка со списком выбора вариантов сортировки и выбора месяца или года отображения --}}
        {{-- ************************************************ --}}
        <div class="mt-4 mb-4 statistics-header" ref='beforeStickyPosition'>
            <div class="row align-items-center">

                {{-- Выпадающий список: какие объекты показвать в колонке лучших --}}
                {{-- ********************************* --}}
                <div class="col-12 col-md-auto">
                    <p class="m-0 h-6 d-inline">Статистика:</p>
                    <select v-model='ratingBy' :size='ratingBy' class='ms-2  inline-select'>
                        <option v-for='rate, key in ratingOptions' :key='"options" + key' :value='key'
                            :disabled="(key === '-')">
                            @{{ rate }}</option>
                    </select>
                </div>

                {{-- Выбор даты начала периода отображения --}}
                {{-- ********************************* --}}
                <div class="mt-2 mt-md-0 col-auto">
                    <div class="datepicker-holder">
                        <span class="label">с </span>
                        <datepicker class='ms-2' :_date='dateRange.start' @date-changed='setDate("start", $event)' />
                    </div>
                </div>
                {{-- ********************************* --}}

                {{-- Выбор даты завершения периода отображения --}}
                {{-- ********************************* --}}
                <div class="mt-2 mt-md-0 col-auto d-flex align-items-center">
                    <div class="datepicker-holder">
                        <span class="label">
                            по </span>
                        <datepicker :_date='dateRange.end' class='ms-2' @date-changed='setDate("end", $event)' />
                    </div>
                </div>
                {{-- ********************************* --}}

                {{-- кнопки выбора фиксированных периодов --}}
                {{-- ********************************* --}}
                <div class="col-12 col-sm-auto mt-2 mt-md-0 d-flex d-sm-block">
                    <button class="btn btn-sm btn-primary-alt col" type='button' @click='setPeriod("month")'>Месяц</button>
                    <button class="btn btn-sm btn-primary-alt ms-2 col" type='button'
                        @click='setPeriod("quarter")'>Квартал</button>
                    <button class="btn btn-sm btn-primary-alt ms-2 col" type='button'
                        @click='setPeriod("year")'>Год</button>
                </div>
                {{-- ********************************* --}}

            </div>
        </div>
        {{-- ************************************************ --}}

        {{-- заголовок с выбором периода --}}
        {{-- ************************************************ --}}
        <div class="row flex-grow-1">
            <div class="align-self-start mt-5 text-center d-none" ref='emptyMessage' v-show='!ratingData.length'>
                <p class="h3 error mt-5">
                    Данные не обнаружены
                </p>
            </div>
            {{-- Список отфильтрованных данных --}}
            {{-- ************************************************ --}}
            <Transition name='fade'>
                <div class='col-12 col-md-6 d-none d-md-block' v-show='ratingData.length'>
                    <transition-group tag='div' class='statistics-list' :css="false" name='sort'>
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
                <div class="col-12 col-md-6 d-flex flex-column " v-if='ratingData.length' ref='observeResize'>
                    <div class="d-flex flex-column statistics-details p-4" :ref='"fixposition"'>

                        {{-- Ряд с данными:
                         - собрано урожая,
                         - всего рабочих дней,
                         - лучший сбор за день
                        --}}
                        {{-- ************************************************ --}}
                        <div class="row">
                            <div class="col-6 col-sm-4">
                                <div class="statistics-data">
                                    <h3 class="statistics-data__label">Собрано урожая</h3>
                                    <Transition name='fade'>
                                        <p class="statistics-data__value">
                                            @{{ statData.collected }}
                                        </p>
                                    </Transition>
                                </div>
                            </div>
                            <div class="col-6 col-sm-4">
                                <div class="statistics-data">
                                    <h3 class="statistics-data__label">Рабочих дней</h3>
                                    <Transition name='fade'>
                                        <p class="statistics-data__value">
                                            @{{ statData.daysCount }}
                                        </p>
                                    </Transition>
                                </div>
                            </div>
                            <div class="col-12 col-sm-4 mt-2 mt-sm-0">
                                <div class="statistics-data">
                                    <h3 class="statistics-data__label">Лучший сбор за день</h3>
                                    <Transition name='fade'>
                                        <p class="statistics-data__value">
                                            @{{ statData.bestDay.collected }}
                                            <span class="statistics-data__value_secondary">@{{ statData.bestDay.date }}</span>
                                        </p>
                                    </Transition>
                                </div>
                            </div>
                        </div>
                        {{-- ************************************************ --}}

                        {{-- график динамики уборки  --}}
                        {{-- ************************************************ --}}
                        <div class="flex-grow-1 mt-2 d-flex flex-column">
                            <h3 class="h6 m-0">
                                Динамика уборки урожая за @{{ currentPeriod }}
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
                                @{{ top5Title }}
                            </h3>
                            <div class="row">
                                <div class="col-12">
                                    <transition-group :css="false" name='sort'>
                                        <div class="statistics-best-item" v-for='item,key in top5' :key='"top5" + item.pid'
                                            :data-index='key'>
                                            <i class="statistics-best-item__icon"
                                                :class='"statistics-best-item__icon" + key'></i>
                                            <h4 class="statistics-best-item__name">@{{ item.name }}</h4>
                                            <p class="statistics-best-item__persantage text-end">@{{ item.amount }}</p>
                                        </div>
                                    </transition-group>
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

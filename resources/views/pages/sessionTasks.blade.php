{{-- Страница сменных заданий --}}
@extends('layouts.public')

@section('content')
    <div class="container-xl d-none h-100 flex-column pb-4" id='public-tasks'>
        {{-- данные об id пользователя и организации для приложения VUE --}}
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        {{-- ************************************************ --}}

        {{-- компонент отображения сообщений  --}}
        {{-- ************************************************ --}}
        <messages :_messages='messages' v-on:cancel-msg='cancelConfirmActionHandler' v-on:confirm-msg='confirmActionHandler'
            v-on:clear-msg='clearMessages'></messages>
        {{-- ************************************************ --}}

        <div class="container mt-4">
            <div class="org-wrapper">
                <div class="d-flex align-content-stretch">
                    <h4 class='h6 m-0  align-self-center'>График сменности</h4>
                    <div class="search-block ms-4">
                        <search @search='execSearch'></search>
                    </div>
                    {{-- Выбор даты начала периода отображения --}}
                    {{-- ********************************* --}}
                    <div class="ms-4 col-auto d-flex align-content-stretch">
                        <div class="datepicker-holder datepicker-holder__shrink">
                            <span class="label">с </span>
                            <datepicker class='ms-2' :_date='dateRange.start' @date-changed='setDate("start", $event)' />
                        </div>
                    </div>
                    {{-- ********************************* --}}

                    {{-- Выбор даты завершения периода отображения --}}
                    {{-- ********************************* --}}
                    <div class="ms-2 col-auto d-flex align-content-stretch">
                        <div class="datepicker-holder datepicker-holder__shrink">
                            <span class="label">
                                по </span>
                            <datepicker :_date='dateRange.end' class='ms-2' @date-changed='setDate("end", $event)' />
                        </div>
                    </div>
                    {{-- ********************************* --}}
                </div>
                <div class="tasks-container py-3 mt-4">
                    <div class="tasks-container__header pb-3">
                        <div class="row">
                            <div class="col-3"></div>
                            <div class="col-9">
                                <days :_date-range=dateRange.selected></days>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

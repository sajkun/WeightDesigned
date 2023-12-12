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
                <div class="d-flex align-content-stretch flex-wraps">
                    <h4 class='h6 m-0  align-self-center'><b>График сменности</b></h4>
                    <div class="search-block ms-4">
                        <search @search='execSearch'></search>
                    </div>
                    {{-- Выбор даты начала периода отображения --}}
                    {{-- ********************************* --}}
                    <div class="ms-4 col-auto d-flex align-content-stretch">
                        <div class="datepicker-holder datepicker-holder__shrink">
                            <span class="label">с </span>
                            <datepicker class='ms-2' :_date='dateRange.selected.start'
                                @date-changed='setDate("start", $event)' />
                        </div>
                    </div>
                    {{-- ********************************* --}}

                    {{-- Выбор даты завершения периода отображения --}}
                    {{-- ********************************* --}}
                    <div class="ms-2 col-auto d-flex align-content-stretch">
                        <div class="datepicker-holder datepicker-holder__shrink">
                            <span class="label">
                                по </span>
                            <datepicker :_date='dateRange.selected.end' class='ms-2'
                                @date-changed='setDate("end", $event)' />
                        </div>
                    </div>
                    {{-- ********************************* --}}
                </div>
                <div class="tasks-container  mt-4">
                    <div class="tasks-container__header">
                        <div class="row m-0">
                            <div class="col-3 border-right py-3"></div>
                            <div class="col-9 px-0 py-3">
                                <days :_date-range=dateRange.selected v-on:show-dates='updateDisplayPeriod'></days>
                            </div>
                        </div>
                    </div>
                    <div class="task-container__body">
                        <item v-for='item, key in harvesters' :key='"harv" + key' :_info='item'
                            :_date-range='dateRange.display' :_tasks='tasks'
                            v-on:add-employee-request='showEmployeesModal' v-on:choose-time-request='showChooseTimeModal'
                            :class='"m-0"'>
                        </item>

                        <item v-for='item, key in transporters' :key='"transporters" + key' :_info='item'
                            :_date-range='dateRange.display' :_tasks='tasks'
                            v-on:add-employee-request='showEmployeesModal' v-on:choose-time-request='showChooseTimeModal'
                            :class='"m-0"'>
                        </item>
                    </div>
                </div>
            </div>
        </div>
        @include('pages.session-tasks.modal-employees')

        <modal-time :_show='activeModal === "chooseTime"' v-on:close-request = 'closeModal' v-on:submited ='setTask'
            :_task-selected='taskSelected' :_base-date='taskDate' v-on:delete-request='deleteTask'
            v-on:message-request='showMessage'></modal-time>
    </div>
@endsection

@extends('layouts.public')

@section('content')
    <div class="container-fluid d-flex flex-grow-1 flex-column" id='home-page'>
        <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionCb' v-on:confirm-msg='confirmActionCb'
            v-on:clear-msg='clearMessages'></messages-component>
        <div class="row flex-grow-1 ">
            <div class="col-12 col-md-6">
                <switcher-component :_buttons="modes" @clicked='changeMode'>
                </switcher-component>
                <div class="mt-4"></div>
                <calendar :_initial-date='"2023-10-25"' :_select-period='true'></calendar>
            </div>
            <div class="col-12 col-md-6">
                <div class="h-100 w-100" id="map"></div>
            </div>
        </div>
    </div>
@endsection

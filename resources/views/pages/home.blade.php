@extends('layouts.public')

@section('content')
    <div class="container-fluid d-flex flex-grow-1 flex-column" id='home-page'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <div class="pt-4" ref='beforeStickyPosition'></div>
        <div class="row flex-grow-1 ">
            <Transition name="fade">
                <div class="col-12 col-md-6">
                    <div class="org-wrapper mb-4">
                        {{-- НАЧАЛО БЛОКА  отображения списка БВС  --}}
                        <div class="py-2  px-1" v-if='display==="list"'>

                            {{-- превью с данными БВС  --}}
                            <bvs-short-component @select='selectBvsCb' v-for='bvs, key in bsvFilteredByUnit'
                                :key='"key" + bvs' class='mt-2' :_bvs='bvs'></bvs-short-component>

                            {{-- Кнопка перехода к режиму просмотра отдельных транзакций бвс --}}
                            <div class="div" v-if='selectedBvs.length > 0'>
                                <button class="btn btn-primary-alt w-100 text-center mt-2" type='button'
                                    @click='changeDisplay("items")'>Продолжить</button>
                            </div>
                        </div>
                        {{--  КОНЕЦ БЛОКА отображения списка БВС --}}

                        {{-- НАЧАЛО БЛОКА  отображения списка операций --}}
                        <div class="py-2" v-if='display==="items"'>
                            {{-- операции БВС --}}
                            <bvs-operation :_info='info' :key='"operation" + key' v-for='info,key in bvsOperations'
                                @selected='selectOperationCb'>
                            </bvs-operation>
                        </div>
                    </div>
                    {{--  КОНЕЦ БЛОКА отображения списка операций --}}
                </div>
            </Transition>

            {{-- НАЧАЛО БЛОКА карты  --}}
            <div class="col-12 col-md-6" :ref='"observeResize"'>
                <div class="d-flex flex-column pb-3" :ref='"fixposition"' key='mapHolder'>
                    {{-- контейнер для Яндекс карты --}}
                    <bvs-map :_id='"map"' v-if='showMap' :class='"flex-grow-1"'
                        :_bvs-data='bvsFilteredByOperations' :_grasslands-data='grasslandsData'></bvs-map>
                </div>
            </div>
            {{-- КОНЕЦ БЛОКА карты  --}}
        </div>
    </div>
@endsection

{{-- Шаблон отображения списка полей, добавления нового поля,  редактирования поля --}}
@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none h-100" id='public-grasslands'>
        <div class="p-sm-3 h-100">
            <div class="d-flex flex-column h-100">
                <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
                <input type="hidden" ref='userId' value='{{ $user_id }}'>

                {{-- Компонент сообщений --}}
                {{-- ********************** --}}
                <messages-component :_messages='messages' v-on:cancel-msg='cancelConfirmActionHandler'
                    v-on:confirm-msg='confirmActionHandler' v-on:clear-msg='clearMessages'></messages-component>
                {{-- ********************** --}}
                <h2 class="h5 mt-3" ref='beforeStickyPosition'>Поля</h2>

                {{-- таблица со списком полей --}}

                <div class="h-100 position-relative" v-show='mode === "list" || mode === "details" '>
                    <Transition name="fade">
                        <div class="align-self-start" v-if='mode === "list" || mode === "details" '>
                            <div class="row h-100">
                                <div class='' :class="columnClass.tableClass">
                                    <div class="d-flex org-wrapper flex-column">
                                        @can('create', [App\Models\Grassland::class, $organisation_id])
                                            <button class="btn m-2 d-block btn-borders" type="button"
                                                @click='addGrassland'>Добавить
                                                поле</button>
                                        @endcan
                                        <table class="organisation mt-3">
                                            <tbody>
                                                <tr>
                                                    <th>№</th>
                                                    <th>Название</th>
                                                    <th>Площадь</th>
                                                    <th>Культура</th>
                                                    <th></th>
                                                </tr>
                                                <tr v-for='item, key in grasslandsList' :key='"grassland" + key + item.id'
                                                    @click='viewGrassland(item)'>
                                                    <td>@{{ key + 1 }}</td>
                                                    <td title='Название:'>@{{ item.name }}</td>
                                                    <td title='Площадь:'>@{{ item.size }} га</td>
                                                    <td title='Культура:'>@{{ item.culture }} </td>
                                                    <td class='text-end'>
                                                        @can('delete', [App\Models\Grassland::class, $organisation_id])
                                                            <button class='btn p-1' @click.prevent.stop='deleteGrassland(item)'>
                                                                <i class="fa fa-solid fa-trash"></i>
                                                            </button>
                                                        @endcan
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>

                {{-- ********************** --}}

                {{-- раздел с формой создания поля --}}
                @can('create', [App\Models\Grassland::class, $organisation_id])
                    @include('pages.grasslands.create')
                @endcan
                {{-- ********************** --}}

                {{-- раздел с формой редактирования поля --}}
                @can('viewAny', [App\Models\Grassland::class, $organisation_id])
                    @include('pages.grasslands.view')
                @endcan
                {{-- ********************** --}}
            </div>
        </div>
    </div>
@endsection

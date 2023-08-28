@extends('layouts.public')

@section('content')
    <div class="container-fluid d-none h-100" id='public-grasslands'>
        <input type="hidden" ref='organisationId' value='{{ $organisation_id }}'>
        <input type="hidden" ref='userId' value='{{ $user_id }}'>
        <Transition :key='"msg" + key' name="bounce" v-for='msg, key in messages'>
        </Transition>

        <Transition name="fade">
            <div class="h-100 position-relative" v-if='mode === "list" || mode === "details" '>
                <div class="p-3 align-self-start">

                    <div class="row h-100">
                        <div class='' :class="columnClass.tableClass">
                            <div class="d-lg-flex org-wrapper flex-column h-100">
                                @can('create', [App\Models\Grassland::class, $organisation_id])
                                    <button class="btn w-100 btn-borders" type="button" @click='addGrassland'>Добавить
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
                                        <tr v-for='item, key in grasslands' :key='"grassland" + key'>
                                            <td>@{{ key + 1 }}</td>
                                            <td>@{{ item.name }}</td>
                                            <td>@{{ item.size }} га</td>
                                            <td>@{{ item.culture }} </td>
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
            </div>
        </Transition>

        @can('create', [App\Models\Grassland::class, $organisation_id])
            @include('pages.grasslands.create')
        @endcan
    </div>
@endsection

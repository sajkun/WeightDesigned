<div class="flex-column flex-grow-1" v-show='mode==="edit"' :class="{ 'd-flex': mode==='edit' }">
    @can('update', [App\Models\Grassland::class, $organisation_id])
        <h3 class="h6">Редактирование поля @{{ grasslandToEdit.name }}</h3>
    @elsecan('viewAny', [App\Models\Grassland::class, $organisation_id])
        <h3 class="h6"> @{{ grasslandToEdit.name }}</h3>
    @endcan

    <div class="row flex-grow-1 position-relative" v-if='mode==="edit"'>
        <div class="col-12 col-md-6">
            <div class="org-wrapper p-3">
                <p class="h6">
                    @include('pages.grasslands.svg')
                    данные поля
                </p>
                <div class="mt-2">
                    @can('update', [App\Models\Grassland::class, $organisation_id])
                        {{-- форма добавления поля --}}
                        <the-form v-if='geoJsonSource === "file"' ref='editGrasslandForm' :_structure='editFormStructure'
                            @exec-submit='editGrassland' :key='"editFormKey" + grasslandToEdit.id'
                            @file-changed='parseShapeFile'
                            @cancel-form='mode="list"'>
                            <input type="hidden" name='id' :value='grasslandToEdit.id'>
                            <input type="hidden" name='geo_json' ref='geo_json'>
                               <div class="row mb-2">
                                    <div class="col-6">
                                        <button class="btn btn-borders-grey-light p-1 d-block w-100" type='button' @click='clearMap'>Очистить
                                            карту</button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-borders-grey-light p-1 d-block w-100" type='button' @click='geoJsonSource="map"'
                                            :key='"doDraw"'>Задать контур вручную</button>
                                    </div>
                                </div>
                        </the-form>
                        {{-- ------------------------- --}}

                        {{-- Блок с кнопками сохранения и отмены режима ручного добавления контура карты --}}
                        <div v-if='geoJsonSource === "map"'>
                            <div class="row">
                                <div class="col-12 text-let">
                                    <p style='color:var(--grey)' class='comment'>Ручной режим задания контура карты. Задайте точки контура
                                        кликнув мышкой на карту. Точки будут отрисованы в том порядке в котором заданы. По завершению нажмите
                                        кнопку "Сохранить контур"</p>
                                </div>
                                <div class="col-4 mt-2">
                                    <button class="btn btn-borders-grey p-1 d-block w-100" type='button'
                                        @click='geoJsonSource="file"'>Отмена</button>
                                </div>
                                <div class="col-4 mt-2">
                                    <button class="btn btn-borders-grey p-1 d-block w-100" type='button' @click='clearMap'>Очистить
                                        карту</button>
                                </div>
                                <div class="col-4 mt-2">
                                    <button class="btn btn-primary-alt p-1 d-block w-100" type='button' :key='"applyDrawn2"'
                                        @click='applyMannualMap'>Сохранить контур</button>
                                </div>

                            </div>
                        </div>
                        {{-- ------------------------- --}}

                    {{-- Фрагмент, отображаемый для пользователя не имеющего права редактировать карту --}}
                    @elsecan('viewAny', [App\Models\Grassland::class, $organisation_id])@include('pages.grasslands.details') @endcan
                            {{-- ------------------------- --}} </div>
                    </div>
                </div>
                @include('pages.grasslands.map')
            </div>
        </div>
    </div>

<div class="pt-4" v-if='activeTab=== "settings"'>
    <form method='POST' id='editVehicleForm' ref='editVehicleForm' @submit='updateVehicle'>

        <input type="hidden" name='id' v-model='editedVehicle.id'>
        <p class="m-0">
            <i class="icon" v-html='listIcon'></i>
            Информация о технике
        </p>

        <div class="row">
            <div class="col-12 col-sm-6 mt-3" v-if='!editedVehicle.pin'>
                <div class="form-control-custom">
                    <input type="text" id='vehicleEditName' name='name' v-model='editedVehicle.name'
                        autocomplete='off' required>
                    <label for="vehicleEditName" :class='{ "active": editedVehicle.name }'>Название</label>
                </div>
            </div>
            <div class="col-12 col-sm-6 mt-3" v-if='editedVehicle.type !== "bunker"'>
                <div class="form-control-custom">
                    <input type="text" id='vehicleModelEdit' v-model='editedVehicle.model' name='model'
                        key='modelEditInput' required>
                    <label for="vehicleModelEdit" key='labelEditInout'
                        :class='{ "active": editedVehicle.model }'>Модель</label>
                </div>
            </div>
            <div class="col-12 col-sm-6 mt-3" v-if='editedVehicle.type=== "bunker"'>
                <div class="form-control-custom h-100">
                    <select id='vehicleModelEdit' name='model' class='h-100' key='modelEditSelect'
                        v-model='editedVehicle.model' required>
                        <option disabled hidden selected>--выберите модель--</option>
                        <option v-for='model,key in bunkerModels' :key='"model" + key' :value="model">
                            @{{ model }}
                        </option>
                    </select>
                    <label class='active' for="vehicleModelEdit" key='labelEditSelect'>Модель</label>
                </div>
            </div>

            <div v-if='editedVehicle.type=== "bunker"'>
                <div class='row' v-if='!editedVehicle.pin'>
                    <div class="col-12 col-sm-6 mt-2 ">
                        <div class="form-control-custom">
                            <input type="text" id='vehicleEditPin' v-model='pincode' key='bunkerEditPin'
                                name='pin' title='введите 5 цифр'>
                            <label for="vehicleEditPin" :class='{ "active": pincode }'>Пин-код (5 цифр)</label>
                        </div>
                    </div>

                    <div class="col-12 col-sm-6 mt-2 ">
                        <button class="btn btn-borders w-100 h-100" type='button' @click='checkPin( "edit")'>Проверить
                            пин</button>
                    </div>
                </div>

            </div>
        </div>
        {{-- ---------------------------------- --}}
        {{-- блок ответственного за технику --}}
        {{-- ---------------------------------- --}}
        <div class="horisontal-separator my-4"></div>
        <p class="m-0">
            <i class="icon" v-html='lockIcon'></i>
            Ответственный за технику
        </p>

        <div class="mt-3">
            <div class="col-12" v-if='mayBeResponsiblePerson'>
                <div class="responsible">
                    <div class="row">
                        <div class="col-6 align-self-center">
                            <h3 class="responsible__title">Ответственный</h3>
                        </div>

                        <div class="col-6 text-end">
                            <button class="btn btn-close p-0" type="button" @click='mayBeResponsiblePerson=null'>
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 align-self-center">
                            <h4 class="responsible__label ">ФИО</h4>
                        </div>
                        <div class="col-6 align-self-center">
                            <h4 class="responsible__label">Должность</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <p class="responsible__text">
                                @{{ mayBeResponsiblePerson.last_name }}
                                @{{ mayBeResponsiblePerson.first_name }}
                                @{{ mayBeResponsiblePerson.middle_name }}
                            </p>
                        </div>
                        <div class="col-6">
                            <p class="responsible__text">@{{ mayBeResponsiblePerson.specialisation }}</p>
                        </div>
                    </div>
                </div> {{-- responsible --}}

            </div>
            <button class="btn btn-borders w-100 mt-2" type="button" @click='popup="employees"'>Назначить
                ответственного</button>
        </div>
        <div class="horisontal-separator my-4"></div>

        {{-- ---------------------------------- --}}
        {{-- блок сгруппированной техники --}}
        {{-- ---------------------------------- --}}
        <p class="m-0"><i class="icon" v-html="chainIcon"></i>
            Сгруппированная техника
        </p>
        <div class="row mt-3 narrow-row">
            <div class="col-12 col-md-6 mt-2" v-for='vehicle, key in mayBeGroupedVehicles' :key='"group" + key'>
                <div class="responsible h-100">
                    <div class="row">
                        <div class="col-6 align-self-center">
                            <h3 class="responsible__title">Связанная техника</h3>
                        </div>

                        <div class="col-6 text-end">
                            <button class="btn p-0 btn-close" :key='"delete" + key' type="button"
                                @click='removeFromGroup(vehicle, true)'>
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 align-self-center">
                            <h4 class="responsible__label ">Название</h4>
                        </div>
                        <div class="col-6 align-self-center">
                            <h4 class="responsible__label">Модель</h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <p class="responsible__text">
                                @{{ vehicle.name }}
                            </p>
                        </div>
                        <div class="col-6">
                            <p class="responsible__text">@{{ vehicle.model }}</p>
                        </div>
                    </div>
                </div> {{-- responsible --}}
            </div>
            <div class="col mt-2">
                <button class="btn btn-borders w-100 h-100" @click='popup="vehicles"' type="button">
                    Сгруппировать</button>
            </div>
        </div>
        <div class="horisontal-separator my-4"></div>

        {{-- ---------------------------------- --}}
        {{-- блок rfid меток --}}
        {{-- ---------------------------------- --}}
        <p class="m-0">
            <i class="icon" v-html="rfidIcon"></i>
            данные RFID меток транспорта
        </p>

        <div class="d-flex narrow-row">
            <div class="mt-2 me-1 col-sm-6" v-for='rfid, key in rfidsComputed'>
                <div class="responsible">
                    <div class="row">
                        <div class="col-6 align-self-center">
                            <h3 class="responsible__title"> @{{ rfid.label }}</h3>
                        </div>

                        <div class="col-6 text-end">
                            <button class="btn p-0 btn-close" type="button" @click='removeRfid(rfid)'>

                            </button>
                        </div>
                    </div>
                    <div class="row">

                        <div class="col-12 align-self-center">
                            <h4 class="responsible__label">Данные RFID</h4>
                        </div>
                    </div>
                    <div class="row">

                        <div class="col-12">
                            <p class="responsible__text">@{{ rfid.value }}</p>
                        </div>
                    </div>
                </div> {{-- responsible --}}

            </div>
        </div>

        <button class="btn btn-borders w-100 mt-2" type="button" @click='popup="rfids"'>Добавить
            RFID метку</button>

        <div class="mt-2 text-end">
            <button type="button" type='button' @click='mode="list"'
                class="btn btn-borders-grey ">Закрыть</button>

            <button type="button" type='submit' @click='updateVehicle'
                class="btn btn-primary-alt ms-1">Сохранить</button>
        </div>
    </form>
</div>

<div class="p-3 align-self-start">
    <div class="row">
        <div class="col-10">
            <h3 class='h5'>Добавление техники</h3>
        </div>
        <div class="col text-end">
            <button class="btn p-0 btn-close" type='button' @click='mode="list"'>
            </button>
        </div>
    </div>

    <div class="d-lg-flex flex-column h-100 mt-3">
        <p class='m-0'>
            <i class='icon' v-html='truckIcon'></i>
            тип техники
        </p>

        <div class="mt-2 org-wrapper p-0">
            <button v-for='vehicle, key in vehicleTypesList' :key='"btn" + key'
                class="btn btn-borders-grey-light col-lg-3 col-12 col-sm-6" type='button' @click='vehicleAddType = key'
                :class='{ "active": vehicleAddType === key }'>@{{ vehicle.name }}</button>
        </div>

        <div class="mt-2 org-wrapper" v-if='vehicleAddType'>
            <p class='m-0'>
                <i class='icon' v-html='listIcon'></i>
                Данные техники
            </p>
            <form method='POST' @submit.prevent='createVehicle' ref='formCreateVehicle'>
                <input type="hidden" name='type' :value='vehicleAddType'>
                <div class="mt-3 row" v-if='vehicleAddType !== "bunker"'>
                    <input type="hidden" name='pin' ref='bunkerPin' key='bunkerPinHidden' v-model='pincode'>
                    <div class="col-12 col-sm-6 ">
                        <div class="form-control-custom">
                            <input type="text" id='vehicleName' name='name' key='name1' autocomplete='off'
                                required>
                            <label for="vehicleName" key='labelName1'>Название</label>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-control-custom">
                            <input type="text" id='vehicleModel' name='model' required key='modelInput'>
                            <label for="vehicleModel">Модель</label>
                        </div>
                    </div>
                </div>

                <div class="mt-3 row" v-if='vehicleAddType === "bunker"'>
                    <div class="col-12 col-sm-6 ">
                        <div class="form-control-custom">
                            <input type="text" id='vehicleName' name='name' key='name2' autocomplete='off'
                                ref='bunkerName' required>
                            <label for="vehicleName" key='labelName2'>Название</label>
                        </div>
                    </div>

                    <div class="col-12 col-sm-6 mt-sm-0 mt-2">
                        <div class="form-control-custom h-100">
                            <select id='vehicleModel' name='model' class='h-100' required key='modelSelect'>
                                <option disabled hidden selected>--выберите модель--</option>
                                <option v-for='model,key in bunkerModels' :key='"model" + key' :value="model">
                                    @{{ model }}
                                </option>
                            </select>
                            <label class='active' for="vehicleModel">Модель</label>
                        </div>
                    </div>

                    <div class="col-12 col-sm-6 mt-2 ">
                        <div class="form-control-custom">
                            <input type="text" id='vehiclePin' name='pin' ref='bunkerPin' key='bunkerPin'
                                v-model='pincode' maxlength="5" minlength="5" title='длина пин-кода ровно 5 символов'>
                            <label for="vehiclePin" :class='{ "active": pincode }'> Пин-код (5 цифр) </label>
                        </div>
                    </div>

                    <div class="col-12 col-sm-6 mt-2 ">
                        <button class="btn btn-borders w-100 h-100" type='button' @click='checkPin'>Проверить
                            пин</button>
                    </div>
                </div>
            </form>
        </div>

        <div class="mt-2 org-wrapper" v-if='vehicleAddType'>
            <p class='m-0'>
                <i class="icon" v-html='lockIcon'></i>
                Ответственный за технику
            </p>

            <div class="row mt-3">
                <div class="col-12 col-md-6" v-if='mayBeResponsiblePerson'>
                    <div class="responsible">
                        <div class="row">
                            <div class="col-6 align-self-center">
                                <h3 class="responsible__title">Ответственный</h3>
                            </div>

                            <div class="col-6 text-end">
                                <button class="btn p-0 btn-close" type="button"
                                    @click='mayBeResponsiblePerson=null'>

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
                <div class="col">
                    <button class="btn btn-borders w-100 h-100" type="button" @click='popup="employees"'>Назначить
                        ответственного</button>
                </div>
            </div>
        </div>

        <div class="mt-2 org-wrapper" v-if='vehicleAddType'>
            <p class='m-0'>
                <i class="icon" v-html='chainIcon'></i>
                Сгруппированная техника
            </p>

            <div class="row mt-3 narrow-row">
                <div class="col-12 col-md-6 mt-2" v-for='vehicle, key in mayBeGroupedVehicles' :key='"group" + key'>
                    <div class="responsible  h-100">
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
        </div>

        <div class="mt-2 org-wrapper" v-if='vehicleAddType'>
            <p class="m-0">
                <i class="icon" v-html='rfidIcon'></i>
                RFID метки
            </p>

            <div class="row narrow-row">
                <div class="col-12 col-md-6 mt-2" v-for='rfid, key in rfidsComputed'>
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
            </button>
        </div>



        <div class="mt-2 text-end">
            <button class="btn btn-borders-grey" @click='mode="list"' type='button'>Закрыть</button>
            <button class="btn btn-primary-alt ms-2" type='button' @click='submitCreate'>Сохранить</button>
        </div>
    </div>
</div>

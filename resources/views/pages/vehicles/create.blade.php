<div class="p-3 align-self-start">
    <h3 class='h5'>Добавление техники</h3>
    <div class="d-lg-flex flex-column h-100 mt-3">
        <p class='m-0'>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M22.381 12.101L22.3806 12.1009L21.068 11.5328L19.9364 9.33079C19.9364 9.33062 19.9363 9.33046 19.9362 9.33029C19.5977 8.66344 18.9116 8.24826 18.1635 8.25291H16.3225V7.84029C16.3225 6.74129 15.4445 5.8417 14.3417 5.8417H4.82192C3.71794 5.8417 2.85012 6.74696 2.85012 7.84029V16.4571C2.8406 17.1603 3.40239 17.7366 4.10533 17.7467L4.10533 17.7468H4.10749H4.20807C4.2359 19.0784 5.3215 20.1533 6.66106 20.158C8.00817 20.1627 9.10812 19.0848 9.13307 17.7423H16.5231C16.5509 19.0739 17.6365 20.1488 18.9761 20.1535C20.3232 20.1582 21.4231 19.0803 21.4481 17.7378H21.8745C22.578 17.7378 23.1498 17.1661 23.1498 16.4626V13.276C23.1593 12.7762 22.8541 12.3074 22.381 12.101ZM15.1294 7.839V7.84029V7.84476V13.1244H4.04316V7.84476C4.04316 7.39955 4.38784 7.0392 4.82192 7.0392H14.3411C14.7805 7.04329 15.1332 7.4042 15.1294 7.839ZM18.8793 9.8743L19.659 11.383H16.3225V9.45041L18.1639 9.45042L18.1658 9.4504C18.4632 9.44664 18.7407 9.60847 18.8792 9.87414C18.8793 9.8742 18.8793 9.87425 18.8793 9.8743ZM21.9613 13.2855L21.9612 13.2855V13.2923V16.4671C21.9612 16.5024 21.9495 16.5263 21.9368 16.54C21.9251 16.5526 21.9074 16.5626 21.879 16.5626H21.1776C20.5754 15.3931 19.1513 14.8988 17.949 15.4603C17.4549 15.6893 17.0501 16.0794 16.8022 16.5626H16.3225V12.5761H20.5168L21.9037 13.1866C21.9394 13.2059 21.963 13.2482 21.9613 13.2855ZM6.67498 18.9694C5.97195 18.9694 5.40505 18.4025 5.40505 17.6995C5.40505 16.9964 5.97195 16.4295 6.67498 16.4295C7.37801 16.4295 7.94491 16.9964 7.94491 17.6995C7.94491 18.398 7.37355 18.9694 6.67498 18.9694ZM15.1294 16.5626H8.86323C8.44649 15.7425 7.59856 15.2232 6.67498 15.2275C5.74724 15.2232 4.90302 15.7382 4.4865 16.5626H4.12535C4.09698 16.5626 4.07919 16.5526 4.06751 16.54C4.05488 16.5263 4.04316 16.5024 4.04316 16.4671V14.3175H15.1294V16.5626ZM18.99 18.9694C18.287 18.9694 17.7201 18.4025 17.7201 17.6995C17.7201 16.9964 18.287 16.4295 18.99 16.4295C19.693 16.4295 20.2599 16.9964 20.2599 17.6995C20.2599 18.3983 19.6927 18.9694 18.99 18.9694Z"
                    fill="#292E3A" stroke="#292E3A" stroke-width="0.3" />
            </svg>
            тип техники
        </p>

        <div class="mt-2 org-wrapper p-0">
            <button v-for='vehicle, key in vehicleTypesList' :key='"btn" + key'
                class="btn btn-borders-grey-light col-lg-3 col-12 col-sm-6" type='button' @click='vehicleType = key'
                :class='{ "active": vehicleType === key }'>@{{ vehicle.name }}</button>
        </div>

        <div class="mt-2 org-wrapper" v-if='vehicleType'>
            <p class='m-0'>
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.1174 10.5625C21.1172 10.3514 21.0423 10.1434 20.887 9.98801L14.387 3.48801C14.2316 3.33216 14.0237 3.25655 13.8125 3.25655V3.25H8.9375C6.69759 3.25 4.875 5.07259 4.875 7.3125V18.6875C4.875 20.9274 6.69759 22.75 8.9375 22.75H17.0625C19.3024 22.75 21.125 20.9274 21.125 18.6875V10.5625H21.1174ZM14.625 6.02393L18.3511 9.75H17.0625C15.7184 9.75 14.625 8.65663 14.625 7.3125V6.02393ZM17.0625 21.125H8.9375C7.59337 21.125 6.5 20.0316 6.5 18.6875V7.3125C6.5 5.96837 7.59337 4.875 8.9375 4.875H13V7.3125C13 9.55241 14.8226 11.375 17.0625 11.375H19.5V18.6875C19.5 20.0316 18.4066 21.125 17.0625 21.125ZM17.0625 17.875C17.0625 18.3241 16.6987 18.6875 16.25 18.6875H9.75C9.3013 18.6875 8.9375 18.3241 8.9375 17.875C8.9375 17.4259 9.3013 17.0625 9.75 17.0625H16.25C16.6987 17.0625 17.0625 17.4259 17.0625 17.875ZM17.0625 14.625C17.0625 15.0741 16.6987 15.4375 16.25 15.4375H9.75C9.3013 15.4375 8.9375 15.0741 8.9375 14.625C8.9375 14.1759 9.3013 13.8125 9.75 13.8125H16.25C16.6987 13.8125 17.0625 14.1759 17.0625 14.625ZM8.9375 11.375C8.9375 10.9259 9.3013 10.5625 9.75 10.5625H11.375C11.8237 10.5625 12.1875 10.9259 12.1875 11.375C12.1875 11.8241 11.8237 12.1875 11.375 12.1875H9.75C9.3013 12.1875 8.9375 11.8241 8.9375 11.375Z"
                        fill="#292E3A" />
                </svg>
                Данные техники
            </p>
            <form method='POST' @submit.prevent='createVehicle' ref='formCreateVehicle'>
                <div class="mt-3 row" v-if='vehicleType !== "bunkers"'>
                    <div class="col-12 col-sm-6 ">
                        <div class="form-control-custom">
                            <input type="text" id='vehicleName' name='name' key='name1' autocomplete='off'
                                required>
                            <label for="vehicleName" key='labelName1'>Название</label>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6">
                        <div class="form-control-custom">
                            <input type="text" id='vehicleModel' name='model' required>
                            <label for="vehicleModel">Модель</label>
                        </div>
                    </div>
                </div>
                <div class="mt-3 row" v-if='vehicleType === "bunkers"'>
                    <div class="col-12 col-sm-6 ">
                        <div class="form-control-custom">
                            <input type="text" id='vehicleName' name='name' key='name2' autocomplete='off'
                                ref='bunkerName' required>
                            <label for="vehicleName" key='labelName2'>Название</label>
                        </div>
                    </div>

                    <div class="col-12 col-sm-6 mt-sm-0 mt-2">
                        <div class="form-control-custom h-100">
                            <select id='vehicleModel' name='model' class='h-100' required>
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
                            <input type="text" id='vehiclePin' name='pin' ref='bunkerPin'>
                            <label for="vehiclePin">Пин код</label>
                        </div>
                    </div>

                    <div class="col-12 col-sm-6 mt-2 ">
                        <button class="btn btn-borders w-100 h-100" type='button' @click='checkPin'>Проверить
                            пин</button>
                    </div>
                </div>
            </form>
        </div>

        <div class="mt-2 org-wrapper" v-if='vehicleType'>
            <p class='m-0'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16.5 10.5V6.75C16.5 4.26472 14.4853 2.25 12 2.25C9.51472 2.25 7.5 4.26472 7.5 6.75V10.5M6.75 21.75H17.25C18.4926 21.75 19.5 20.7426 19.5 19.5V12.75C19.5 11.5074 18.4926 10.5 17.25 10.5H6.75C5.50736 10.5 4.5 11.5074 4.5 12.75V19.5C4.5 20.7426 5.50736 21.75 6.75 21.75Z"
                        stroke="#292E3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
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
                                <button class="btn" type="button" @click='mayBeResponsiblePerson=null'>
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                        aria-hidde='true' xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.5 19.5L19.5 6.5M6.5 6.5L19.5 19.5" stroke="#F1898E"
                                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
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
                        отвественного</button>
                </div>
            </div>
        </div>

        <div class="mt-2 org-wrapper" v-if='vehicleType'>
            <p class='m-0'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13.1903 8.68842C13.6393 8.90291 14.0601 9.19611 14.432 9.56802C16.1893 11.3254 16.1893 14.1746 14.432 15.932L9.93198 20.432C8.17462 22.1893 5.32538 22.1893 3.56802 20.432C1.81066 18.6746 1.81066 15.8254 3.56802 14.068L5.32499 12.311M18.675 11.689L20.432 9.93198C22.1893 8.17462 22.1893 5.32538 20.432 3.56802C18.6746 1.81066 15.8254 1.81066 14.068 3.56802L9.56802 8.06802C7.81066 9.82538 7.81066 12.6746 9.56802 14.432C9.93992 14.8039 10.3607 15.0971 10.8097 15.3116"
                        stroke="#292E3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                Сгруппированная техника
            </p>

            <div class="row mt-3">
                <div class="col-12 col-md-6" v-if='mayBeGroupedVehicles.length'>
                    <div class="responsible" v-for='vehicle, key in mayBeGroupedVehicles' :key='"group" + key'>
                        <div class="row">
                            <div class="col-6 align-self-center">
                                <h3 class="responsible__title">Связанная техника</h3>
                            </div>

                            <div class="col-6 text-end">
                                <button class="btn" type="button">
                                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                        aria-hidde='true' xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.5 19.5L19.5 6.5M6.5 6.5L19.5 19.5" stroke="#F1898E"
                                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
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
                <div class="col">
                    <button class="btn btn-borders w-100 h-100" type="button">
                        Сгруппировать</button>
                </div>
            </div>
        </div>

        <div class="mt-2 text-end">
            <button class="btn btn-borders-grey" @click='mode="list"' type='button'>Отмена</button>
            <button class="btn btn-primary-alt" type='button' @click='submitCreate'>Сохранить</button>
        </div>
    </div>
</div>

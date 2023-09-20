<div class="" v-if='activeTab=== "settings"'>
    <div class="mt-3"></div>
    <p class="m-0"><svg width="26" height="26" viewBox="0 0 26 26" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21.1174 10.5625C21.1172 10.3514 21.0423 10.1434 20.887 9.98801L14.387 3.48801C14.2316 3.33216 14.0237 3.25655 13.8125 3.25655V3.25H8.9375C6.69759 3.25 4.875 5.07259 4.875 7.3125V18.6875C4.875 20.9274 6.69759 22.75 8.9375 22.75H17.0625C19.3024 22.75 21.125 20.9274 21.125 18.6875V10.5625H21.1174ZM14.625 6.02393L18.3511 9.75H17.0625C15.7184 9.75 14.625 8.65663 14.625 7.3125V6.02393ZM17.0625 21.125H8.9375C7.59337 21.125 6.5 20.0316 6.5 18.6875V7.3125C6.5 5.96837 7.59337 4.875 8.9375 4.875H13V7.3125C13 9.55241 14.8226 11.375 17.0625 11.375H19.5V18.6875C19.5 20.0316 18.4066 21.125 17.0625 21.125ZM17.0625 17.875C17.0625 18.3241 16.6987 18.6875 16.25 18.6875H9.75C9.3013 18.6875 8.9375 18.3241 8.9375 17.875C8.9375 17.4259 9.3013 17.0625 9.75 17.0625H16.25C16.6987 17.0625 17.0625 17.4259 17.0625 17.875ZM17.0625 14.625C17.0625 15.0741 16.6987 15.4375 16.25 15.4375H9.75C9.3013 15.4375 8.9375 15.0741 8.9375 14.625C8.9375 14.1759 9.3013 13.8125 9.75 13.8125H16.25C16.6987 13.8125 17.0625 14.1759 17.0625 14.625ZM8.9375 11.375C8.9375 10.9259 9.3013 10.5625 9.75 10.5625H11.375C11.8237 10.5625 12.1875 10.9259 12.1875 11.375C12.1875 11.8241 11.8237 12.1875 11.375 12.1875H9.75C9.3013 12.1875 8.9375 11.8241 8.9375 11.375Z"
                fill="#292E3A"></path>
        </svg>
        Информация о сотруднике
    </p>


    <form @submit.prevent="patchEmployee" ref='submitFormEdit' method='POST'>
        <input type="hidden" name='id' v-model='editedEmployee.id'>
        <div class="row narrow-row">
            <field-component v-for='data, key in editEmployeeFormStructure' :_info='data'
                :key='"ff" + key'></field-component>
        </div>

        <div class="horisontal-separator my-4"></div>

        <p class="m-0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M13.1903 8.68842C13.6393 8.90291 14.0601 9.19611 14.432 9.56802C16.1893 11.3254 16.1893 14.1746 14.432 15.932L9.93198 20.432C8.17462 22.1893 5.32538 22.1893 3.56802 20.432C1.81066 18.6746 1.81066 15.8254 3.56802 14.068L5.32499 12.311M18.675 11.689L20.432 9.93198C22.1893 8.17462 22.1893 5.32538 20.432 3.56802C18.6746 1.81066 15.8254 1.81066 14.068 3.56802L9.56802 8.06802C7.81066 9.82538 7.81066 12.6746 9.56802 14.432C9.93992 14.8039 10.3607 15.0971 10.8097 15.3116"
                    stroke="#292E3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            Ответственен за технику
        </p>
        <div class="row mt-3 narrow-row">
            <div class="col-12 col-md-6 mt-2" v-for='vehicle, key in editedEmployee.vehicles' :key='"group" + key'>
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
                    Назначить ответственным</button>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-12 text-end">
                <button type='button' class=' btn  btn-borders-grey' @click='editMode=false'>
                    Закрыть
                </button>
                <button type='submit' class=' btn ms-1  btn-primary-alt'>
                    Сохранить
                </button>
            </div>
        </div>
    </form>

</div>

{{-- Фрагмент шаблона работы с сотрудниками  --}}
<div class="" v-if='activeTab=== "settings"'>
    <div class="mt-3"></div>
    <p class="m-0">
        <i class="icon" v-html="listIcon"></i>
        Информация о сотруднике
    </p>


    <form @submit.prevent="patchEmployee" ref='submitFormEdit' method='POST'>
        <input type="hidden" name='id' v-model='editedEmployee.id'>
        <div class="row narrow-row">
            <field-component v-for='data, key in editEmployeeFormStructure' :_info='data'
                :key='"ff" + key'></field-component>
        </div>

        <div class="horisontal-separator my-4"></div>

        <p class="m-0"><i class="icon" v-html="chainIcon"></i>
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
            <div class="col-6">
                <button type='button' class=' btn w-100 btn-borders-grey' @click='activeTab="info"'>
                    Отмена
                </button>
            </div>
            <div class="col-6">
                <button type='submit' class='w-100 btn ms-1  btn-primary-alt'>
                    Сохранить
                </button>
            </div>
        </div>
    </form>
</div>

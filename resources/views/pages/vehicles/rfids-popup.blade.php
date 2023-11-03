<div class="popup-wrapper" v-if='popup === "rfids"'>
    <div class="popup p-2" style='max-width: 640px'>
        <div class="popup__header ">
            <div class="row">
                <div class="col-8">
                    <p class="m-0">
                        <i class='icon' v-html='rfidIcon'></i>
                        Добавление RFID метки
                    </p>
                </div>
                <div class="col text-end">
                    <button class="btn p-0 btn-close" type="button" @click='popup=null'>
                    </button>
                </div>
            </div>
        </div>
        <div class="popup__body">
            <div class="row">
                <form ref='addRfid' @submit.prevent='submitRfid'>
                    <input type="hidden" :value='organisationId' name='organisation_id'>
                    <div class="row narrow-row">
                        <field-component v-for='data,key in
                        rfidAddFormStructure'
                            :_info='data' :_force-render='1' :key='"rfid-input" + key'></field-component>
                    </div>
                    <div class="mt-2 text-end">
                        <button type='button' @click='checkRfid' class='btn btn-borders ms-2'>Проверить</button>
                        <button type='submit' class='btn btn-primary-alt ms-2'>Сохранить</button>
                    </div>
                </form>
            </div>

        </div>
    </div>
</div>

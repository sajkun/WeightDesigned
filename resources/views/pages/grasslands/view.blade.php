<div class="p-3 d-flex flex-column h-100" v-if='mode==="edit"'>
    <h3 class="h6">Редактирование поля @{{ grassalndToEdit.name }}</h3>
    <div class="row flex-grow-1 position-relative">
        <div class="col-12 col-md-6">
            <div class="org-wrapper">
                <p class="h6">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M21.1174 10.5625C21.1172 10.3514 21.0423 10.1434 20.887 9.98801L14.387 3.48801C14.2316 3.33216 14.0237 3.25655 13.8125 3.25655V3.25H8.9375C6.69759 3.25 4.875 5.07259 4.875 7.3125V18.6875C4.875 20.9274 6.69759 22.75 8.9375 22.75H17.0625C19.3024 22.75 21.125 20.9274 21.125 18.6875V10.5625H21.1174ZM14.625 6.02393L18.3511 9.75H17.0625C15.7184 9.75 14.625 8.65663 14.625 7.3125V6.02393ZM17.0625 21.125H8.9375C7.59337 21.125 6.5 20.0316 6.5 18.6875V7.3125C6.5 5.96837 7.59337 4.875 8.9375 4.875H13V7.3125C13 9.55241 14.8226 11.375 17.0625 11.375H19.5V18.6875C19.5 20.0316 18.4066 21.125 17.0625 21.125ZM17.0625 17.875C17.0625 18.3241 16.6987 18.6875 16.25 18.6875H9.75C9.3013 18.6875 8.9375 18.3241 8.9375 17.875C8.9375 17.4259 9.3013 17.0625 9.75 17.0625H16.25C16.6987 17.0625 17.0625 17.4259 17.0625 17.875ZM17.0625 14.625C17.0625 15.0741 16.6987 15.4375 16.25 15.4375H9.75C9.3013 15.4375 8.9375 15.0741 8.9375 14.625C8.9375 14.1759 9.3013 13.8125 9.75 13.8125H16.25C16.6987 13.8125 17.0625 14.1759 17.0625 14.625ZM8.9375 11.375C8.9375 10.9259 9.3013 10.5625 9.75 10.5625H11.375C11.8237 10.5625 12.1875 10.9259 12.1875 11.375C12.1875 11.8241 11.8237 12.1875 11.375 12.1875H9.75C9.3013 12.1875 8.9375 11.8241 8.9375 11.375Z"
                            fill="#292E3A" />
                    </svg>
                    данные поля
                </p>

                <div class="mt-2">
                    <form @submit.prevent='editGrassland' id="editGrassland" ref='formEditGrassland'>
                        <input type="hidden" name='id' v-model='grassalndToEdit.id'>
                        <div class="row narrow-row">
                            <div class="col-12 col-md-6 mt-2 form-control-custom">
                                <input type="text" v-model='grassalndToEdit.name' id='grasslandName' name='name'
                                    ref='grasslandName' required key='grasslandName'>
                                <label :class="{ 'active': grassalndToEdit.name }" for="grasslandName">Название</label>
                            </div>
                            <div class="col-12 col-md-6 mt-2  form-control-custom">
                                <input type="text" id='grasslandSize' name='size' v-model='grassalndToEdit.size'
                                    ref='grasslandSize' required key='grasslandSize'>
                                <label :class="{ 'active': grassalndToEdit.size }" for="grasslandSize">Размер поля
                                    (га)</label>
                            </div>

                            <div class="col-12 col-md-6 mt-2  form-control-custom">
                                <select id='grasslandCulture' name='culture' class='h-100'
                                    v-model='grassalndToEdit.culture' required key='grasslandCulture'>
                                    <option disabled hidden selected>--выберите культуру--</option>
                                    <option v-for='culture,key in cultures' :key='"culture" + key'
                                        :value="culture">
                                        @{{ culture }}
                                    </option>
                                </select>
                                <label for="grasslandCulture" class='active'>Культура</label>
                            </div>

                            <div class="col-12 col-md-6 mt-2  form-control-custom">
                                <file v-on:changed='parseShapeFile' :_accept="'.shp, .kml, .kmz'" :_id="'grasslandFile'"
                                    :ref="'grasslandFile'" :key="'grasslandFile'">
                                    <span>Файл поля</span>
                                </file>
                                <input type="hidden" name='geo_json' ref='geo_json'>
                            </div>
                        </div>
                        <div class="text-end mt-2">
                            <button class="btn btn-borders-grey" type='button' @click='mode="list"'>Закрыть</button>
                            <button class="btn btn-primary-alt" type='submit'>Сохранить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6">
            <div class="h-100" id='map-container'></div>
        </div>
    </div>
</div>

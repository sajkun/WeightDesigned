@can('update', [App\Models\User::class, $organisation_id])
    <div class="p-2" v-if='activeTab=== "settings"'>
        <form @submit.prevent="submitForm" method='POST'>
            <div class="row">
                <div class="col-12 col-lg-4 col-md-6 mt-2 form-control-custom" :class='{ "d-none": editPassword }'>
                    <input type="text" autocomplete='off' :class='{ "active": editedUser.first_name }' id='first_name'
                        required v-model='editedUser.first_name'>
                    <label for="first_name">Имя </label>
                </div>

                <div class="col-12 col-lg-4 col-md-6 mt-2 form-control-custom" :class='{ "d-none": editPassword }'>
                    <input type="text" autocomplete='off' :class='{ "active": editedUser.last_name }' id='last_name'
                        required v-model='editedUser.last_name'>
                    <label for="last_name">Фамилия </label>
                </div>

                <div class="col-12 col-lg-4  mt-2 form-control-custom" :class='{ "d-none": editPassword }'>
                    <input type="text" autocomplete='off' :class='{ "active": editedUser.middle_name }' id='middle_name'
                        v-model='editedUser.middle_name'>
                    <label for="middle_name">Отчество </label>
                </div>

                <div class="col-12 col-md-6 mt-2 form-control-custom" :class='{ "d-none": editPassword }'>
                    <input type="text" :class='{ "active": editedUser.email }' id='email' required
                        v-model='editedUser.email'>
                    <label for="email">E-mail </label>
                </div>

                <div class="col-12 col-md-6 mt-2 form-control-custom" :class='{ "d-none": editPassword }'>
                    <input type="text" autocomplete='off' :class='{ "active": editedUser.phone }' id='phone' required
                        v-model='editedUser.phone'>
                    <label for="phone">Телефон</label>
                </div>

                <div class="col-12 mt-2 form-control-custom " :class='{ "d-none": editPassword }'
                    v-if='userId != editedUser.id'>
                    <select id='role' :class='{ "active": editedUser.role }'v-model='editedUser.role'>
                        <option v-for='name, key in roles' :key='"role" + key' :value="key"
                            :selected=' key === editedUser.role'>
                            @{{ name }} </option>
                    </select>
                    <label for="role">Роль</label>
                </div>

                <div class="col-12">
                    <div class='row' v-if='editPassword'>
                        <div class="col-12">
                            <div class="form-control-custom ">
                                <input type="password" autocomplete='off' :class='{ "active": passwords.old }'
                                    id='passwordold' v-model='passwords.old'>
                                <label for="passwordold">Старый пароль</label>
                            </div>
                            <div class="form-control-custom mt-2">
                                <input type="text" autocomplete='off' :class='{ "active": passwords.new }'
                                    id='password' v-model='passwords.new'>
                                <label for="password">Новый пароль</label>
                            </div>
                            <button class="btn btn-link" type='button' @click='generatePassword'>Сгенерировать
                                пароль</button>
                        </div>

                        <div class="col-12 col-lg-6 mt-1">
                            <button class="w-100 btn btn-borders-grey" type='button'
                                @click='editPassword=false'>Отмена</button>
                        </div>
                        <div class="col-12 col-lg-6 mt-1">
                            <button class="w-100 btn btn-borders" type='button' @click='submitPassword'>Сохранить
                                пароль</button>
                        </div>
                    </div>
                    <button class="btn-link btn" v-if='!editPassword' type='button'
                        @click='editPassword=true'>Редактировать
                        пароль</button>
                </div>

                <div class="col-12 col-md-6" :class='{ "d-none": editPassword }'>
                    <button type='button' @click='editMode=false' :disabled='editPassword'
                        class='w-100 mt-3 btn btn-borders-grey'>
                        Отмена
                    </button>
                </div>
                <div class="col-12 col-md-6" :class='{ "d-none": editPassword }'>
                    <button type='submit' :disabled='editPassword' class='w-100 mt-3 btn  btn-primary-alt'>
                        Сохранить
                    </button>
                </div>

            </div>
        </form>
    </div>
@endcan

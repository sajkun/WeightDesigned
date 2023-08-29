<form @submit.prevent="storeUser" method='POST'>
    <div class="row">
        <div class="col-12 mt-2">
            <div class="form-control-custom ">
                <input type="text" autocomplete='off' :class='{ "active": editedUser.login }' id='login' required
                    v-model='editedUser.login'>

                <label for="login">Имя учетной записи </label>
            </div>
        </div>

        <div class="col-12 col-md-6  col-lg-4 mt-2 form-control-custom">
            <input type="text" autocomplete='off' :class='{ "active": editedUser.first_name }' id='first_name'
                required v-model='editedUser.first_name'>
            <label for="first_name">Имя </label>
        </div>


        <div class="col-12 col-md-6  col-lg-4 mt-2 form-control-custom">
            <input type="text" autocomplete='off' :class='{ "active": editedUser.last_name }' id='last_name' required
                v-model='editedUser.last_name'>
            <label for="last_name">Фамилия </label>
        </div>

        <div class="col-12   col-lg-4 mt-2 form-control-custom">
            <input type="text" autocomplete='off' :class='{ "active": editedUser.middle_name }' id='middle_name'
                v-model='editedUser.middle_name'>
            <label for="middle_name">Отчество </label>
        </div>

        <div class="col-12 mt-2  col-lg-6 form-control-custom ">
            <input type="text" :class='{ "active": editedUser.email }' id='email' required
                v-model='editedUser.email'>
            <label for="email">E-mail </label>
        </div>

        <div class="col-12 mt-2  col-lg-6 form-control-custom ">
            <input type="text" autocomplete='off' :class='{ "active": editedUser.phone }' id='phone' required
                v-model='editedUser.phone'>
            <label for="phone">Телефон</label>
        </div>

        <div class="col-12 mt-2">
            <div class="form-control-custom mt-2">
                <input type="text" autocomplete='off' required :class='{ "active": passwords.new }' id='password'
                    v-model='passwords.new'>
                <label for="password">Пароль</label>
            </div>
            <button class="btn btn-link" type='button' @click='generatePassword'>Сгенерировать
                пароль</button>
        </div>

        <div class="col-12 mt-2 form-control-custom ">
            <select id='role' :class='{ "active": editedUser.role }'v-model='editedUser.role'>
                <option v-for='name, key in roles' :key='"role" + key' :value="key"
                    :selected=' key === editedUser.role'>
                    @{{ name }} </option>
            </select>
            <label for="role">Роль</label>
        </div>

        <div class="col-12 col-md-6">
            <button type='button' @click='editMode=false' :disabled='editPassword'
                class='w-100 mt-3 btn btn-borders-grey'>
                Отмена
            </button>
        </div>
        <div class="col-12 col-md-6">
            <button type='submit' :disabled='editPassword' class='w-100 mt-3 btn  btn-primary-alt'>
                Сохранить
            </button>
        </div>

    </div>
</form>

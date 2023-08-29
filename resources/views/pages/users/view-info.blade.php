<div class="p-2" v-if='activeTab=== "info"'>
    <div class="row mt-2">
        <div class="col-12 col-md-6 col-lg-4 mt-2">
            <h4 class="m-0 label">Фамилия</h4>
            <p class="mt-1">@{{ editedUser.last_name || '-' }}</p>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mt-2">
            <h4 class="m-0 label">Имя</h4>
            <p class="mt-1">@{{ editedUser.first_name || '-' }}</p>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mt-2">
            <h4 class="m-0 label">Отчество</h4>
            <p class="mt-1">@{{ editedUser.middle_name || '-' }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">Логин</h4>
            <p class="mt-1">@{{ editedUser.login }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">Роль</h4>
            <p class="mt-1"> @{{ roles[editedUser.role] }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2 ">
            <h4 class="m-0 label">Контактный телефон</h4>
            <p class="mt-1">@{{ editedUser.phone }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2 ">
            <h4 class="m-0 label">Email</h4>
            <p class="mt-1">@{{ editedUser.email }}</p>
        </div>
    </div>
</div>

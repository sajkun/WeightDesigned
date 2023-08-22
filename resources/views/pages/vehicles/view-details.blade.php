<div class="" v-if='activeTab=== "info"'>
    <div class="row mt-2">
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">Модель</h4>
            <p class="mt-1">@{{ editedVehicle.model }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">Отвественный</h4>
            <p class="mt-1">@{{ editedVehicle.employee_name ? editedVehicle.employee_name : 'нет' }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">Связанная техника</h4>
            <p class="mt-1">
                <span v-for='item, key in editedVehicle.group' :key='"groupedData" + key'>
                    @{{ item.name }}
                    @{{ item.model }} <br>
                </span>
            </p>
        </div>
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">RFID Метки</h4>
            <p class="mt-1">
                <span v-for='item, key in editedVehicle.rfids' :key='"rfiddData" + key'>
                    @{{ item.label }}
                    @{{ item.value }} <br>
                </span>
            </p>
        </div>
    </div>
</div>

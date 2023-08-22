<div class="" v-if='activeTab=== "info"'>
    <div class="row mt-2">
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">Специальность</h4>
            <p class="mt-1">@{{ editedEmployee.specialisation }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">Работает</h4>
            <p class="mt-1">с @{{ getDate(editedEmployee.created_at) }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2 ">
            <h4 class="m-0 label">Контактный телефон</h4>
            <p class="mt-1">@{{ editedEmployee.phone }}</p>
        </div>
        <div class="col-12 col-md-6 mt-2">
            <h4 class="m-0 label">Ответственен за технику</h4>
            <p class="mt-1">
                <span v-for='item, key in editedEmployee.vehicles' :key='"groupedData" + key'>
                    @{{ item.name }}
                    @{{ item.model }} <br>
                </span>
            </p>
        </div>
    </div>
</div>

<modal @closed='closeModal' :_show='activeModal === "employees"' :class='"md"'>
    <h3 class="h6">Список сотрудников</h3>
    <div class="table-grid-employee table-grid-employee_header">
        <b>#</b>
        <b>ФИО</b>
        <b>Профессия</b>
    </div>
    <div v-if='!employeesByPoffesion.length'>
        <i>Нет сотрудников подходящих для назначения на выбранную технику</i>
    </div>

    <button v-for='employee,key in employeesByPoffesion' :key='"employee" + key' @click='applyEmployee(employee)'
        class='w-100 p-0 btn'>
        <div class="table-grid-employee">
            <span>@{{ key + 1 }}</span>
            <span>@{{ formatName(employee.last_name, employee.first_name, employee.middle_name) }}</span>
            <span>@{{ employee.specialisation }}</span>
        </div>
    </button>
</modal>

<div class="popup-wrapper" v-if='popup === "employees"'>
    <div class="popup p-2">
        <div class="popup__header pt-2">
            <div class="row">
                <div class="col-8">
                    <p class="m-0">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.6903 8.68842C14.1393 8.90291 14.5601 9.19611 14.932 9.56802C16.6893 11.3254 16.6893 14.1746 14.932 15.932L10.432 20.432C8.67462 22.1893 5.82538 22.1893 4.06802 20.432C2.31066 18.6746 2.31066 15.8254 4.06802 14.068L5.82499 12.311M19.175 11.689L20.932 9.93198C22.6893 8.17462 22.6893 5.32538 20.932 3.56802C19.1746 1.81066 16.3254 1.81066 14.568 3.56802L10.068 8.06802C8.31066 9.82538 8.31066 12.6746 10.068 14.432C10.4399 14.8039 10.8607 15.0971 11.3097 15.3116"
                                stroke="#292E3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        назначение ответственного сотрудника
                    </p>
                </div>
                <div class="col text-end">
                    <button class="btn p-0" type="button" @click='popup=null'><svg width="27" height="26"
                            viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 19.5L20 6.5M7 6.5L20 19.5" stroke="currentColor" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="popup__body">
            <div class="px-1">
                <div class="search-wrapper">
                    <input type="text" class="w-100 search-field" v-model='employeeSearch' id='employeeSearch'>

                    <label for="employeeSearch">

                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" aria-hidde='true'
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21.5 21L16.3033 15.8033M16.3033 15.8033C17.6605 14.4461 18.5 12.5711 18.5 10.5C18.5 6.35786 15.1421 3 11 3C6.85786 3 3.5 6.35786 3.5 10.5C3.5 14.6421 6.85786 18 11 18C13.0711 18 14.9461 17.1605 16.3033 15.8033Z"
                                stroke="#AAB3CB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </label>
                </div>

            </div>

            <table class="organisation mt-3">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>ФИО</th>
                        <th>телефон</th>
                        <th>профессия</th>
                    </tr>

                    <tr v-for='person, key in employeesList' :key='"person" + key'
                        @click='selectResponsiblePerson(person)'>
                        <td>@{{ person.id }}</td>
                        <td>@{{ person.last_name }} @{{ person.first_name }} @{{ person.middle_name }}</td>
                        <td>@{{ person.phone }}</td>
                        <td>@{{ person.specialisation }}</td>
                    </tr>

                    <tr v-if='employeesList.length === 0' class='no-hover'>
                        <td colspan='4' class='alert-danger'><span class="alert">Сотрудники не найдены</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

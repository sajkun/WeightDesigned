<div class="popup-wrapper" v-if='popup === "vehicles"'>
    <div class="popup p-2">
        <div class="popup__header ">
            <div class="row">
                <div class="col-8">
                    <p class="m-0">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M13.6903 8.68842C14.1393 8.90291 14.5601 9.19611 14.932 9.56802C16.6893 11.3254 16.6893 14.1746 14.932 15.932L10.432 20.432C8.67462 22.1893 5.82538 22.1893 4.06802 20.432C2.31066 18.6746 2.31066 15.8254 4.06802 14.068L5.82499 12.311M19.175 11.689L20.932 9.93198C22.6893 8.17462 22.6893 5.32538 20.932 3.56802C19.1746 1.81066 16.3254 1.81066 14.568 3.56802L10.068 8.06802C8.31066 9.82538 8.31066 12.6746 10.068 14.432C10.4399 14.8039 10.8607 15.0971 11.3097 15.3116"
                                stroke="#292E3A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        Группировка техники
                    </p>
                </div>
                <div class="col text-end">
                    <button class="btn p-0  btn-close" type="button" @click='popup=null'>
                    </button>
                </div>
            </div>
        </div>

        <div class="popup__body">
            <div class="mt-3">
                Добавленная техника

                <div class="d-flex">
                    <div class="btn btn-borders me-1" v-for='item, key in group' :key="'vehicleTag' + key">
                        <div class="row
                        narrow-row">
                            <div class='col align-self-center'>@{{ item.name }} @{{ item.mode }}</div>
                            <button class="col align-self-center btn p-0 btn-close" type='button'
                                @click='removeFromGroup(item)'></button>
                        </div>
                    </div>
                </div>
            </div>
            <nav class="tabs mt-2">
                <div class="row">
                    <ul>
                        <li v-for='vehicle, key in vehicleTypesList' :key='"btn" + key'
                            :class="{
                                'd-none': (key === 'harvester' || key === 'transporter')
                            }">
                            <button class="btn  btn-tab" type='button' @click='vehicleGroupType = key'
                                :class='{ "active": vehicleGroupType === key }'>@{{ vehicle.name }}</button>
                        </li>
                    </ul>
                </div>
            </nav>

            <table class="organisation mt-3">
                <tbody>
                    <tr>
                        <th>№</th>
                        <th>Название</th>
                        <th>Модель</th>
                        <th>Ответственный</th>
                        <th></th>
                    </tr>
                    <tr v-for='item, key in vehiclesGrouped' :key='"vehicklerow" + key'
                        @click='switchVehicleGroupMembership(item)'>
                        <td>@{{ key }}</td>
                        <td>@{{ item.name }}</td>
                        <td>@{{ item.model }}</td>
                        <td>@{{ item.employee_name }}</td>
                        <th width='100' class='text-end'>
                            @can('delete', [App\Models\Vehicle::class, $organisation_id])
                                <button class='btn p-1' @click.prevent.stop='deleteVehicle(item)'>
                                    <i class="fa fa-solid fa-trash"></i>
                                </button>
                            @endcan
                        </th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="mt-2 text-end">
            <button type='buttom' @click='applyGroup' class='btn btn-primary-alt ms-2'>Сохранить</button>
        </div>
    </div>
</div>

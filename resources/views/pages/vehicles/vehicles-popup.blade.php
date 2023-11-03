{{-- Всплвающее окно для добвления техники в группу --}}
<div class="popup-wrapper" v-if='popup === "vehicles"'>
    <div class="popup p-2">
        <div class="popup__header ">
            <div class="row">
                <div class="col-8">
                    <p class="m-0 h5">
                        <i class="icon" v-html='chainIcon'></i>
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
                <span v-if='group.length'>Выбранная техника</span>
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

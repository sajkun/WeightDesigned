<?php

namespace App\Models;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Grassland;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organisation extends Model
{
    use HasFactory;

    protected $guarded = false;


    public function authorizedBunkers($mode = 'object')
    {
        $vehicles = $this->vehicles()->get();

        /**
         * Учитываются только весовые системы с подтверждеными пинкодами
         */
        $bunkers = $vehicles->filter(function ($vehicle) {
            return $vehicle['type'] === 'bunker' && count($vehicle->pincode()->get()) !== 0;
        });

        $data = $mode === 'object' ?
            $bunkers :
            $bunkers->map(function ($bunker) use ($mode) {
                return $bunker[$mode];
            });

        return $data;
    }

    /**
     * получение всех имеющихся данных от зарегистированных бункеров перегрузчиков
     *
     * @return Array
     */
    public function bvsData()
    {
        $bunkerNames = $this->authorizedBunkers('name')->toArray();
        $bvsData = BvsData::whereIn('bvs_name', $bunkerNames)->get()->toArray();
        return $bvsData;
    }



    /**
     * получет все данные об активности выбранной сущности
     *
     * @param ownerId - integer id сущности, которая запрашивает
     * @param ownerType - Enum bunker/tractor/harvester/transporter/employee
     *
     * @return Object|false
     */
    public function bvsDataByOwner($ownerId = -1, $ownerType = null)
    {
        $owners = ['bunker', 'tractor', 'harvester', 'transporter', 'employee'];
        if ($ownerId < 0 || !in_array($ownerType, $owners)) {
            return false;
        }

        $owner = $ownerType === 'employee' ? Employee::find($ownerId) : Vehicle::find($ownerId);

        if ((int)$owner['organisation_id'] !== (int)$this->id) {
            return [];
        }

        $data = $ownerType === 'employee' ? $this->bvsDataByEmployee($owner) : $this->bvsDataByVehicle($owner);

        return $data;
    }


    /**
     * получет все данные об активности выбранной техники
     *
     * @param vehicle - Vehicle
     *
     * @return Object|false
     */
    public function bvsDataByVehicle(Vehicle $vehicle)
    {
        if ((int)$vehicle['organisation_id'] !== (int)$this->id) {
            return [];
        }

        $bvsData = [];
        $key = 'bvs_name';
        $vehicleName = null;

        /**
         * определяем имя техники и нвзывание колонки в базе, с которым сравнивать имя техники
         */
        switch ($vehicle['type']) {
            case 'tractor':
                if ($vehicle['group_id']) {
                    $groupBunkers = Group::find($vehicle['group_id'])->vehicles()->get()->filter(function ($vh) {
                        return $vh['type'] === 'bunker';
                    });
                    $bunker = $groupBunkers->first();
                    $vehicleName = $bunker['name'];
                }
                break;
            default:
                $vehicleName = $vehicle['name'];
                $key = $vehicle['type'] === 'harvester' ? 'from' : $key;
                $key = $vehicle['type'] === 'transporter' ? 'to' : $key;
                break;
        }

        /**
         * Имена авторизованных бункеров перегрузчиков
         */
        $bunkerNames = $this->authorizedBunkers('name')->filter(function ($name) use ($key, $vehicleName) {
            return $key === 'bvs_name' ? $vehicleName === $name : true;
        })->toArray();

        $bvsData = BvsData::where($key, $vehicleName)->get();

        $bvsData =  $key === 'bvs_name' ? $bvsData->toArray() : $bvsData->filter(function ($d) use ($bunkerNames) {
            return in_array($d['bvs_name'], $bunkerNames);
        })->toArray();

        return $bvsData;
    }

    public function bvsDataByEmployee(Employee $employee)
    {

        return [];
    }

    /**
     * список пользователей системы
     *
     * @return Object
     */
    public function users()
    {
        return $this->hasMany(User::class, 'organisation_id', 'id');
    }

    /**
     * список сотрудников
     *
     * @return Object
     */
    public function employees()
    {
        return $this->hasMany(Employee::class, 'organisation_id', 'id');
    }

    /**
     * список техники
     *
     * @return Object
     */
    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'organisation_id', 'id');
    }

    /**
     * список полей
     *
     * @return Object
     */
    public function grasslands()
    {
        return $this->hasMany(Grassland::class, 'organisation_id', 'id');
    }
}

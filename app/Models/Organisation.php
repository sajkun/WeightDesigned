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

    /**
     * получение всех имеющихся данных от зарегистированных бункеров перегрузчиков
     *
     * @return Array
     */
    public function bvsData()
    {
        $bunkers = [];
        $vehicles = $this->vehicles()->get();

        /**
         * Учитываются только весовые системы с подтверждеными пинкодами
         */
        $bunkers = $vehicles->filter(function ($vehicle) {
            return $vehicle['type'] === 'bunker' && count($vehicle->pincode()->get()) !== 0;
        });

        $bunkerNames = $bunkers->map(function ($bunker) {
            return $bunker['name'];
        })->toArray();

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
    public function getBvsData($ownerId = -1, $ownerType = null)
    {
        $owners = ['bunker', 'tractor', 'harvester', 'transporter', 'employee'];
        if ($ownerId < 0 || !in_array($ownerType, $owners)) {
            return false;
        }

        return $this->id;
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

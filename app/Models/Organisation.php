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

    // получение всех имеющихся данных от бункеров перегрузчиков
    public function bvsData()
    {
        $bunkers = [];
        $vehicles = $this->vehicles()->get();
        $bunkers = $vehicles->filter(function ($vehicle) {
            return $vehicle['type'] === 'bunker' && count($vehicle->pincode()->get()) !== 0;
        });

        $bunkerNames = $bunkers->map(function ($bunker) {
            return $bunker['name'];
        })->toArray();

        $bvsData = BvsData::whereIn('bvs_name', $bunkerNames)->get()->toArray();

        return $bvsData;
    }

    public function users()
    {
        return $this->hasMany(User::class, 'organisation_id', 'id');
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'organisation_id', 'id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'organisation_id', 'id');
    }

    public function grasslands()
    {
        return $this->hasMany(Grassland::class, 'organisation_id', 'id');
    }
}

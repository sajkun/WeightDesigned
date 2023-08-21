<?php
namespace App\Models;

use App\Models\Rfid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Vehicle extends Model
{
    use HasFactory;

    protected $guarded = false;

    public function getPincode()
    {
        return $this->pincode();
    }

    public function pincode(): HasOne
    {
        return $this->hasOne(Pincode::class, 'vehicle_id');
    }

    public function employee():BelongsTo
    {
        return $this->BelongsTo(Employee::class, 'employee_id', 'id');
    }

    public function rfids(): HasMany
    {
        return $this->hasMany(Rfid::class, 'vehicle_id');
    }
}

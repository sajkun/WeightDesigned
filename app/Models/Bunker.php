<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Bunker extends Model
{
    use HasFactory;

    protected $guarded = false;

    public function getPincode()
    {
        return $this->pincode();
    }

    public function pincode(): HasOne
    {
        return $this->hasOne(Pincode::class, 'bunker_id');
    }

    public function employee():BelongsTo
    {
        return $this->BelongsTo(Employee::class, 'employee_id', 'id');
    }
}

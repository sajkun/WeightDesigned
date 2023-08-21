<?php
namespace App\Models;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rfid extends Model
{
    use HasFactory;
    protected $guarded = false;

    public function vehicle():BelongsTo
    {
        return $this->BelongsTo(Vehicle::class, 'vehicle_id', 'id');
    }
}

<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $guarded = false;

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class, 'employee_id', 'id');
    }
}

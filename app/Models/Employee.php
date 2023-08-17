<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;
    protected $guarded = false;

    public function bunkers()
    {
        return $this->hasMany(Bunker::class, 'employee_id', 'id');
    }
}

<?php
namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organisation extends Model
{
    use HasFactory;

    protected $guarded = false;

    public function users()
    {
        return $this->hasMany(User::class, 'organisation_id', 'id');
    }

    public function employees()
    {
        return $this->hasMany(Employee::class, 'organisation_id', 'id');
    }
}

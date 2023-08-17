<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pincode extends Model
{
    use HasFactory;
    protected $guarded = false;

    public function checkName($name)
    {
        return $this->name !== $name;
    }

    public function checkPin($pin)
    {
        return $this->pin !== $pin;
    }

    public function checkIfRegistered()
    {
        return $this->updated_at;
    }
}

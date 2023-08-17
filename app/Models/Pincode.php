<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function bunker() :BelongsTo
    {
        return $this->belongsTo(Bunker::class, 'bunker_id');
    }

    public function checkIfRegistered()
    {
        return !!count($this->bunker()->get());
    }
}

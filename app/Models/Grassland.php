<?php
namespace App\Models;

use App\Models\Organisation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grassland extends Model
{
    use HasFactory;
    protected $guarded = false;

    public function organisation():BelongsTo
    {
        return $this->BelongsTo(Organisation::class, 'organisation_id', 'id');
    }
}

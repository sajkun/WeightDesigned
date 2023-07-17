<?php
namespace App\Http\Controllers;

use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PublicController extends Controller
{
    public function __construct(Request $request)
    {
    }

    public function prepareData()
    {
        $user = Auth::user();
        $organisation = Organisation::find($user->organisation_id);

        view()->share('organisation', $organisation->name);
    }
}

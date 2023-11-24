<?php

namespace App\Http\Controllers\PublicArea\SessionTask;

use App\Models\SessionTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PublicController;

class IndexController extends PublicController
{
    /**
     * Handle the incoming request.
     *
     * @return Illuminate\Support\Facades\View
     */
    public function __invoke()
    {
        $this->authorize('view', [SessionTask::class, Auth::user()->organisation_id]);
        $this->prepareData();
        return view('pages.sessionTasks');
    }
}

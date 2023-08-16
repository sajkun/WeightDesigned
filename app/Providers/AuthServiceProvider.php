<?php
namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
        'App\Models\User' => 'App\Policies\PublicArea\UserPolicy',
        'App\Models\Employee' => 'App\Policies\PublicArea\EmployeePolicy',
        'App\Models\Bunker' => 'App\Policies\PublicArea\VehiclePolicy',
        'App\Models\Tractor' => 'App\Policies\PublicArea\VehiclePolicy',
        'App\Models\Transporter' => 'App\Policies\PublicArea\VehiclePolicy',
        'App\Models\Harvester' => 'App\Policies\PublicArea\VehiclePolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}

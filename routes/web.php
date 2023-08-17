<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('login')->name('login.attempt')->uses('Auth\LoginController@login');

Route::group(['middleware' => 'auth'], function () {
    Route::resource('/', 'DashController');
    Route::post('/logout')->name('logout')->uses('Auth\LoginController@logout');
    Route::get('/', 'PublicArea\IndexController')->name('public.index');
    Route::group(['namespace' => 'PublicArea\Users', 'prefix' => 'users'], function () {
        Route::get('/', 'IndexController')->name('public.users.index');
    });
    Route::group(['namespace' => 'PublicArea', 'prefix' => 'vehicles'], function () {
        Route::get('/', 'ListController')->name('public.vehicles.list');
    });
    Route::group(['namespace' => 'PublicArea\Employees', 'prefix' => 'employees'], function () {
        Route::get('/', 'IndexController')->name('public.employee.index');
        Route::post('/store', 'StoreController')->name('public.employee.store');
        Route::post('/edit', 'PatchController')->name('public.employee.edit');
        Route::post('/delete', 'DestroyController')->name('public.employee.delete');
    });
    Route::group(['namespace' => 'PublicArea\Bunker', 'prefix' => 'bunkers'], function () {
        Route::get('/', 'IndexController')->name('public.bunker.index');
        Route::post('/store', 'StoreController')->name('public.bunker.store');
        Route::post('/edit', 'PatchController')->name('public.bunker.edit');
        Route::post('/delete', 'DestroyController')->name('public.bunker.delete');
        Route::post('/pincode', 'CheckPinController')->name('public.bunker.pincode');
    });
    Route::group(['namespace' => 'PublicArea\Tractor', 'prefix' => 'tractors'], function () {
        Route::get('/', 'IndexController')->name('public.tractor.index');
        Route::post('/store', 'StoreController')->name('public.tractor.store');
        Route::post('/edit', 'PatchController')->name('public.tractor.edit');
        Route::post('/delete', 'DestroyController')->name('public.tractor.delete');
    });
    Route::group(['namespace' => 'PublicArea\Transporter', 'prefix' => 'transporters'], function () {
        Route::get('/', 'IndexController')->name('public.transporter.index');
        Route::post('/store', 'StoreController')->name('public.transporter.store');
        Route::post('/edit', 'PatchController')->name('public.transporter.edit');
        Route::post('/delete', 'DestroyController')->name('public.transporter.delete');
    });
    Route::group(['namespace' => 'PublicArea\Harvester', 'prefix' => 'harvesters'], function () {
        Route::get('/', 'IndexController')->name('public.harvester.index');
        Route::post('/store', 'StoreController')->name('public.harvester.store');
        Route::post('/edit', 'PatchController')->name('public.harvester.edit');
        Route::post('/delete', 'DestroyController')->name('public.harvester.delete');
    });
});

Route::group(['namespace' => 'Admin', 'prefix' => 'admin'], function () {
    Route::get('/', 'IndexController')->name('admin.index');
    Route::group(['namespace' => 'User', 'prefix' => 'users'], function () {
        // Route::get('/', 'IndexController')->name('admin.user.index');
        // Route::get('/create', 'CreateController')->name('admin.user.create');
        // Route::get('/{user}/edit', 'EditController')->name('admin.user.edit');
        // Route::post('/store', 'StoreController')->name('admin.user.store');
        // Route::patch('/{user}', 'UpdateController')->name('admin.user.update');
        Route::delete('/{user}', 'DestroyController')->name('admin.user.destroy');
    });

    Route::group(['namespace' => 'Organisation', 'prefix' => 'organisations'], function () {
        // Route::get('/create', 'CreateController')->name('admin.organisation.create');
        // Route::get('/{organisation}/edit', 'EditController')->name('admin.organisation.edit');
        Route::post('/store', 'StoreController')->name('admin.organisation.store');
        // Route::patch('/{organisation}', 'UpdateController')->name('admin.organisation.update');
        Route::delete('/{organisation}', 'DestroyController')->name('admin.organisation.destroy');
    });
});

// Route::group(['namespace' => 'PublicArea', 'prefix' => '/'], function () {
//     Route::get('/', 'IndexController')->name('public.index');
// });

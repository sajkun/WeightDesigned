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

    Route::group(['namespace' => 'PublicArea\BvsData', 'prefix' => 'bvsdata'], function () {
        Route::post('/list', 'ListController')->name('public.bvsdata.list');
        Route::post('/by-owner', 'SingleItemController')->name('public.bvsdata.by.owner');
    });

    Route::group(['namespace' => 'PublicArea\Info', 'prefix' => 'data'], function () {
        Route::get('/rating', 'RatingController')->name('public.data.rating');
        Route::get('/statistics', 'StatisticsController')->name('public.data.statistics');
    });

    Route::group(['namespace' => 'PublicArea\User', 'prefix' => 'users'], function () {
        Route::get('/', 'IndexController')->name('public.users.index');
        Route::get('/list', 'ListController')->name('public.user.list');
        Route::post('/store', 'StoreController')->name('public.user.store');
        Route::post('/update', 'PatchController')->name('public.user.edit');
        Route::post('/delete', 'DestroyController')->name('public.user.delete');
        Route::post('/password', 'PasswordController')->name('public.user.chapwd');
    });

    Route::group(['namespace' => 'PublicArea\Employee', 'prefix' => 'employees'], function () {
        Route::get('/list', 'ListController')->name('public.employee.list');
        Route::get('/', 'IndexController')->name('public.employee.index');
        Route::post('/store', 'StoreController')->name('public.employee.store');
        Route::post('/update', 'PatchController')->name('public.employee.edit');
        Route::post('/delete', 'DestroyController')->name('public.employee.delete');
    });
    Route::group(['namespace' => 'PublicArea\Rfid', 'prefix' => 'rfids'], function () {
        Route::post('/test', 'CheckController')->name('public.rfid.test');
    });
    Route::group(['namespace' => 'PublicArea\Vehicle', 'prefix' => 'vehicles'], function () {
        Route::get('/list', 'ListController')->name('public.vehicle.list');
        Route::get('/{type}', 'IndexController')->name('public.vehicle.index');
        Route::post('/store', 'StoreController')->name('public.vehicle.store');
        Route::post('/update', 'PatchController')->name('public.vehicle.edit');
        Route::post('/delete', 'DestroyController')->name('public.vehicle.delete');
        Route::post('/pincode', 'CheckPinController')->name('public.vehicle.pincode');
        Route::post('/groups', 'ListGroupsController')->name('public.vehicle.groups');
    });
    Route::group(['namespace' => 'PublicArea\Grassland', 'prefix' => 'grasslands'], function () {
        Route::get('/list', 'ListController')->name('public.grassland.list');
        Route::get('/', 'IndexController')->name('public.grassland.index');
        Route::post('/store', 'StoreController')->name('public.grassland.store');
        Route::post('/update', 'PatchController')->name('public.grassland.edit');
        Route::post('/delete', 'DestroyController')->name('public.grassland.delete');
    });

    Route::group(['namespace' => 'PublicArea\SessionTask', 'prefix' => 'tasks'], function () {
        Route::get('/list', 'ListController')->name('public.tasks.list');
        Route::get('/', 'IndexController')->name('public.tasks.index');
        Route::post('/store', 'StoreController')->name('public.tasks.store');
        Route::post('/update', 'PatchController')->name('public.tasks.edit');
        Route::post('/delete', 'DestroyController')->name('public.tasks.delete');
        Route::post('/search', 'SearchController')->name('public.tasks.search');
    });
});

Route::group(['namespace' => 'Admin', 'prefix' => 'admin'], function () {
    Route::get('/', 'IndexController')->name('admin.index');
    Route::group(['namespace' => 'User', 'prefix' => 'users'], function () {
        // Route::get('/', 'IndexController')->name('admin.user.index');
        // Route::get('/create', 'CreateController')->name('admin.user.create');
        // Route::get('/{user}/update', 'EditController')->name('admin.user.edit');
        // Route::post('/store', 'StoreController')->name('admin.user.store');
        // Route::patch('/{user}', 'UpdateController')->name('admin.user.update');
        Route::delete('/{user}', 'DestroyController')->name('admin.user.destroy');
    });

    Route::group(['namespace' => 'Organisation', 'prefix' => 'organisations'], function () {
        // Route::get('/create', 'CreateController')->name('admin.organisation.create');
        // Route::get('/{organisation}/update', 'EditController')->name('admin.organisation.edit');
        Route::post('/store', 'StoreController')->name('admin.organisation.store');
        // Route::patch('/{organisation}', 'UpdateController')->name('admin.organisation.update');
        Route::delete('/{organisation}', 'DestroyController')->name('admin.organisation.destroy');
    });
});

// Route::group(['namespace' => 'PublicArea', 'prefix' => '/'], function () {
//     Route::get('/', 'IndexController')->name('public.index');
// });

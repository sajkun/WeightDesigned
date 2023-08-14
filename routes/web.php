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
    Route::group(['namespace' => 'PublicArea\Employees', 'prefix' => 'employees'], function () {
        Route::get('/', 'IndexController')->name('public.employees.index');
        Route::post('/store', 'StoreController')->name('public.employees.store');
        Route::post('/edit', 'PatchController')->name('public.employees.edit');
        Route::post('/delete', 'DestroyController')->name('public.employees.delete');
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

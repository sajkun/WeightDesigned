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

// Auth::routes();

Route::get('login', [App\Http\Controllers\Auth\LoginController::class, 'showLoginForm'])->name('login');
Route::post('login')->name('login.attempt')->uses('Auth\LoginController@login');

Route::group(['middleware' => 'auth'], function () {
    Route::resource('/', 'DashController');
    Route::post('/logout')->name('logout')->uses('Auth\LoginController@logout');
});

Route::get('/', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::group(['namespace' => 'Admin', 'prefix' => 'admin'], function () {
    Route::get('/', 'IndexController')->name('admin.index');
});

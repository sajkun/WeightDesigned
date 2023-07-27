<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'public/users'
], function ($router) {
    Route::post('list/{organisation_id}', Api\GetUsersController::class);
    Route::post('patch', Api\PatchUsersController::class);
    Route::post('spw', Api\SetUserPasswordController::class);
    Route::post('destroy', Api\DestroyUserController::class);
    Route::post('store', Api\StoreUserController::class);
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'public/employees'
], function ($router) {
    Route::post('list/{organisation_id}', Api\GetEmployeesController::class);
});

<?php

use Illuminate\Http\Request;
use Api\StoreBvsDataController;
use Api\ListEmployeesController;
use Illuminate\Support\Facades\Route;
use Api\ListVehiclesController;

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
    // 'middleware' => 'jwt.auth',
], function ($router) {
    // запись данных от бвс
    Route::post('store', StoreBvsDataController::class);
    //получение списка сотрудников
    Route::post('employees/list', ListEmployeesController::class);
    Route::post('vehicles/list', ListVehiclesController::class);
});

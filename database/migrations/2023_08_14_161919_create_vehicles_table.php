<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVehiclesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name')->nullable()->default('');
            $table->string('model')->nullable()->default('');
            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->index('organisation_id', 'vehicle_organisation_idx');
            $table->foreign('organisation_id', 'vehicle_organisation_fk')->on('organisations')->references('id');

            $table->unsignedBigInteger('employee_id')->nullable();
            $table->index('organisation_id', 'vehicle_employee_idx');
            $table->foreign('employee_id', 'vehicle_employee_fk')->on('employees')->references('id')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vehicles');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSessionTasksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('session_tasks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->timestamp('start')->nullable();
            $table->timestamp('end')->nullable();

            $table->unsignedBigInteger('owner_id')->nullable();
            $table->index('owner_id', 'session_tasks_user_idx');
            $table->foreign('owner_id', 'session_tasks_user_fk')->on('users')->references('id');

            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->index('organisation_id', 'session_tasks_organisation_idx');
            $table->foreign('organisation_id', 'session_tasks_organisation_fk')->on('organisations')->references('id');

            $table->unsignedBigInteger('employee_id')->nullable();
            $table->index('employee_id', 'session_tasks_employee_idx');
            $table->foreign('employee_id', 'session_tasks_employee_id_fk')->on('employees')->references('id');

            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->index('vehicle_id', 'session_tasks_vehicle_idx');
            $table->foreign('vehicle_id', 'session_tasks_vehicle_id_fk')->on('vehicles')->references('id');

            $table->unsignedBigInteger('group_id')->nullable();
            $table->index('group_id', 'session_tasks_group_idx');
            $table->foreign('group_id', 'session_tasks_group_id_fk')->on('groups')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('session_tasks');
    }
}

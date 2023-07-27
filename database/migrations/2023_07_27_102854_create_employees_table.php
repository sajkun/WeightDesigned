<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->index('organisation_id', 'employee_organisation_idx');
            $table->foreign('organisation_id', 'employee_organisation_fk')->on('organisations')->references('id');
            $table->string('first_name')->nullable()->default('');
            $table->string('middle_name')->nullable()->default('');
            $table->string('last_name')->nullable()->default('');
            $table->string('specialisation')->nullable()->default('');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
}

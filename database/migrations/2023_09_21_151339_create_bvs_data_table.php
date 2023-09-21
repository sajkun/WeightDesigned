<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBvsDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bvs_data', function (Blueprint $table) {
            $table->id();
            $table->string('bvs_name')->nullable();
            $table->string('from')->nullable();
            $table->string('to')->nullable();
            $table->integer('rfid_status')->nullable();
            $table->integer('amount_in_bunker')->nullable();
            $table->integer('amount_transfered')->nullable();
            $table->dateTime('operation_time')->nullable();
            $table->string('accelerometer')->nullable();
            $table->boolean('has_check')->nullable();
            $table->string('error')->nullable();
            $table->json('coordinates')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bvs_data');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWeightData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('weight_data', function (Blueprint $table) {
            $table->id();
            $table->dateTime('operation_time')->nullable();
            $table->integer('ammount_in_bunker')->nullable();
            $table->integer('ammount_received')->nullable();
            $table->integer('ammount_given')->nullable();
            $table->integer('ammount_left')->nullable();
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
        Schema::dropIfExists('weight_data');
    }
}

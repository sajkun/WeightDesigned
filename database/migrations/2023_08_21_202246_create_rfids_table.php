<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRfidsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rfids', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('label')->nullable()->default('');
            $table->string('value')->nullable()->default('');
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->index('vehicle_id', 'rfid_vehicle_idx');
            $table->foreign('vehicle_id', 'rfid_vehicle_fk')->on('vehicles')->references('id')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rfids');
    }
}

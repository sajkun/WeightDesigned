<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnsToWeightData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('weight_data', function (Blueprint $table) {
            $table->string('received_from')->nullable();
            $table->string('delivered_to')->nullable();
            $table->integer('rfid_status')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('weight_data', function (Blueprint $table) {
            $table->dropColumn('rfid_status');
            $table->dropColumn('received_from');
            $table->dropColumn('delivered_to');
        });
    }
}

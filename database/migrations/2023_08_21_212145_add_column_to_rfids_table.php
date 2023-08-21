<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToRfidsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rfids', function (Blueprint $table) {
            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->index('organisation_id', 'rfid_organisation_idx');
            $table->foreign('organisation_id', 'rfid_organisation_fk')->on('organisations')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rfids', function (Blueprint $table) {
            $table->dropForeign('rfid_organisation_fk');
            $table->dropIndex('rfid_organisation_idx');
            $table->dropColumn('organisation_id');
        });
    }
}

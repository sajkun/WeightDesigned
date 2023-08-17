<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToPincodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pincodes', function (Blueprint $table) {
            $table->unsignedBigInteger('bunker_id')->nullable();
            $table->foreign('bunker_id', 'pincode_bunker_fk')->on('bunkers')->references('id')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pincodes', function (Blueprint $table) {
            $table->dropForeign('pincode_bunker_fk');
            $table->dropColumn('bunker_id');
        });
    }
}

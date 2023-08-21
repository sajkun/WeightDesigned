<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGroupColumnToVehiclesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('group_id')->nullable();
            $table->index('group_id', 'vehicle_group_idx');
            $table->foreign('group_id', 'vehicle_group_fk')->on('groups')->references('id')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropForeign('vehicle_group_fk');
            $table->dropIndex('vehicle_group_idx');
            $table->dropColumn('group_id');
        });
    }
}

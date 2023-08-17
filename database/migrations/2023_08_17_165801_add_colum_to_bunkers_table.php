<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumToBunkersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bunkers', function (Blueprint $table) {
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->index('organisation_id', 'bunker_employee_idx');
            $table->foreign('employee_id', 'bunker_employee_fk')->on('employees')->references('id')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bunkers', function (Blueprint $table) {
            $table->dropForeign('bunker_employee_fk');
            $table->dropColumn('employee_id');
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnToGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->index('organisation_id', 'groups_organisation_idx');
            $table->foreign('organisation_id', 'groups_organisation_fk')->on('organisations')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->dropForeign('groups_organisation_fk');
            $table->dropIndex('groups_organisation_idx');
            $table->dropColumn('organisation_id');
        });
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeSessionTasksColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('session_tasks', function (Blueprint $table) {
            $table->string('start')->change();
            $table->string('end')->change();
            $table->string('comment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('session_tasks', function (Blueprint $table) {
            $table->dateTime('start')->change();
            $table->dateTime('end')->change();
            $table->dropColumn('comment');
        });
    }
}

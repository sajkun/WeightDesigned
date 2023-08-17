<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBunkersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bunkers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name')->nullable()->default('');
            $table->string('model')->nullable()->default('');
            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->index('organisation_id', 'bunker_organisation_idx');
            $table->foreign('organisation_id', 'bunker_organisation_fk')->on('organisations')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bunkers');
    }
}

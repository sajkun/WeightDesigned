<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGrasslandsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('grasslands', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name')->nullable()->default('');
            $table->integer('size')->nullable();
            $table->string('geo_json')->nullable();
            $table->string('culture')->nullable();
            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->index('organisation_id', 'grassland_organisation_idx');
            $table->foreign('organisation_id', 'grasslandorganisation_fk')->on('organisations')->references('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('grasslands');
    }
}

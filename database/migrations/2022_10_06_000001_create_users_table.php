<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
        * Run the migrations.
        *
        * @return void
        */
    public function up()
    {
        $roles = array_keys(config('users.roles_nice_names'));

        Schema::create('users', function (Blueprint $table) use ($roles) {
            $table->id();
            $table->string('login')->unique();
            $table->string('email')->unique()->default('');

            $table->string('first_name')->nullable()->default('');
            $table->string('last_name')->nullable()->default('');

            $table->unsignedBigInteger('organisation_id')->nullable();
            $table->index('organisation_id', 'user_organisation_idx');
            $table->foreign('organisation_id', 'user_organisation_fk')->on('organisations')->references('id');

            $table->string('password');
            $table->enum('role', $roles);
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

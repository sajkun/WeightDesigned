<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $password = env('ROOT_PASSWORD', '133355555');
        DB::table('users')->insert([
            'login' => env('ROOT_USER', 'comandante'),
            'password' => Hash::make($password),
            'role' => config('users.superadmin'),
            'created_at' => new \DateTime('now'),
        ]);

        // DB::table('pincodes')->insert([
        //     'name' => 'test',
        //     'pin' => '12345',
        //     'created_at' => new \DateTime('now'),
        // ]);

        // DB::table('pincodes')->insert([
        //     'name' => 'lill1206',
        //     'pin' => '12345',
        //     'created_at' => new \DateTime('now'),
        // ]);
        // DB::table('pincodes')->insert([
        //     'name' => 'lill1209',
        //     'pin' => '12345',
        //     'created_at' => new \DateTime('now'),
        // ]);
        // DB::table('pincodes')->insert([
        //     'name' => 'lill3455',
        //     'pin' => '12345',
        //     'created_at' => new \DateTime('now'),
        // ]);
        // DB::table('pincodes')->insert([
        //     'name' => 'lill1721',
        //     'pin' => '12345',
        //     'created_at' => new \DateTime('now'),
        // ]);

        // DB::table('employees')->insert([
        //     'first_name' => 'Иван',
        //     'middle_name' => 'Петрович',
        //     'last_name' => 'Сидоров',
        //     'phone' => '12345',
        //     'specialisation' => 'Водитель Трактора',
        // ]);
    }
}

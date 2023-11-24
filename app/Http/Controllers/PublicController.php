<?php

/**
 * Контроллер родитель для всех контроллеро публичной зоны
 * Подготавливает общие данные для все шаблонов
 */

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\Access\Gate;
use App\Models\User;
use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PublicController extends Controller
{
    /**
     * Создание нового экземпляра класса
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Подготовка данных для шаблонов
     *
     * @return void
     */
    public function prepareData()
    {

        $this->applyExternalJsLibs();

        // получение данные об авторизованном пользователе и его организации
        $user = Auth::user();
        $organisation = Organisation::find($user->organisation_id);
        $roles = config('users.roles_nice_names');
        unset($roles['admin'], $roles['superadmin']);

        // назначение переменных для шаблонов страниц
        view()->share('roles', $roles);
        view()->share('organisation', $organisation->name);
        view()->share('organisation_id', $organisation->id);
        view()->share('user_id', $user->id);
        view()->share('useYamap', $this->useYamap());
        view()->share('menu',  $this->getMainMenu());
    }

    /**
     * Структура главного меню публичной зоны
     *
     * @return array
     */
    protected function getMainMenu()
    {
        $submenuVehicles = [
            [
                'url' => route('public.vehicle.index', ['type' => 'bunker']),
                'title' => 'Бункеры перегрузчики'
            ],
            [
                'url' => route('public.vehicle.index', ['type' => 'tractor']), 'title' => 'Тракторы'
            ],
            [
                'url' => route('public.vehicle.index', ['type' => 'transporter']), 'title' => 'Грузовики'
            ],
            [
                'url' => route('public.vehicle.index', ['type' => 'harvester']), 'title' => 'Комбайны'
            ]
        ];

        $employeesSubmenu = [
            [
                'url' => route('public.employee.index'),
                'title' => 'Список сотрудников'
            ],
            [
                'url' => route('public.tasks.index'),
                'title' => 'Сменные задания'
            ]
        ];

        /**
         * Главное меню
         */
        $menu = [
            [
                'url' => route('public.grassland.index'),
                'title' => 'Поля',
                'icon' => false,
                'submenu' => false,
                'model' => 'App\Models\Grassland',
            ],
            [
                'url' => route('public.vehicle.index', ['type' => 'bunker']),
                'title' => 'Техника',
                'icon' => false,
                'submenu' => $submenuVehicles,
                'model' => 'App\Models\Vehicle',
            ],
            [
                'url' => route('public.employee.index'),
                'title' => 'Сотрудники',
                'icon' => false,
                'submenu' => $employeesSubmenu,
                'model' => 'App\Models\Employee',
            ],
            [
                'url' => route('public.users.index'),
                'title' => 'Пользователи',
                'icon' => false,
                'submenu' => false,
                'model' => 'App\Models\User',
            ],
            [
                'url' => route('public.data.rating'),
                'title' => 'Рейтинг',
                'icon' => 'fa-star',
                'submenu' => false,
                'model' => 'App\Models\BvsData'
            ],
            [
                'url' => route('public.data.statistics'),
                'title' => 'Статистика',
                'icon' => false,
                'submenu' => false,
                'model' => 'App\Models\BvsData'
            ]
        ];


        $menu = array_filter($menu, function ($el) {
            return true;
        });

        return $menu;
    }

    /**
     * Метод определяющий нужно ли загружать скрипт API яндекс карт
     *
     * @return boolean
     */
    protected function useYamap()
    {
        return false;
    }

    /**
     * Определяет для view массив путей сторонних библиотек
     *
     * @return void
     */
    protected function applyExternalJsLibs()
    {
        view()->share('jslibs', []);
        return;
    }
}

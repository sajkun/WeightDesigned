<?php

/**
 * Контроллер родитель для всех контроллеро публичной зоны
 * Подготавливает общие данные для все шаблонов
 */

namespace App\Http\Controllers;

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
        view()->share('users', $organisation->users()->get());
        view()->share('employees', $organisation->employees()->get());
        view()->share('grasslands', $organisation->grasslands()->get());
        view()->share('useYamap', $this->useYamap());
        view()->share('menu',  $this->getMainMenu());
    }

    /**
     * Структура главного меню пукбличной зоны
     *
     * @return Array
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

        /**
         * Главное меню
         */
        $menu = [
            [
                'url' => route('public.grassland.index'),
                'title' => 'Поля',
                'icon' => false,
                'submenu' => false,
            ],
            [
                'url' => route('public.vehicle.index', ['type' => 'bunker']),
                'title' => 'Техника',
                'icon' => false,
                'submenu' => $submenuVehicles,
            ],
            [
                'url' => route('public.employee.index'),
                'title' => 'Сотрудники',
                'icon' => false,
                'submenu' => false,
            ],
            [
                'url' => route('public.users.index'),
                'title' => 'Пользователи',
                'icon' => false,
                'submenu' => false,
            ],
            [
                'url' => route('public.data.rating'),
                'title' => 'Рейтинг',
                'icon' => 'fa-star',
                'submenu' => false,
            ],
            [
                'url' => route('public.data.statistics'),
                'title' => 'Статистика',
                'icon' => false,
                'submenu' => false,
            ],
        ];

        return $menu;
    }

    /**
     * Метод определяющий нужно ли загружать скрипт API яндекс карт
     */
    protected function useYamap()
    {
        return false;
    }

    /**
     * Определяет для view массив путей сторонних библиотек
     */
    protected function applyExternalJsLibs()
    {
        view()->share('jslibs', []);
        return;
    }
}

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
    }


    /**
     * Метод определяющий нужно ли использовать яндекс карты
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
        return ;
    }
}

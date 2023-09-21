<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>

    @foreach ($jslibs as $url)
        <script src="{{ asset($url) }}" defer></script>
    @endforeach

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    <script src="https://api-maps.yandex.ru/2.1?apikey=164d5998-e082-4c46-9a64-fbb2f9725c6c&load=package.full&lang=ru_RU">
    </script>
</head>

<body class="">
    <header class="public-header py-2">
        <div class="container-fluid">
            <div class="row align-content-center">
                <div class="flex-grow-0 logo align-self-center">
                    <button class="btn btn-link p-0 d-md-none" type='button' id='mobile-menu-toggle'>
                        <svg width="24" height="20" class='open' viewBox="0 0 24 20" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.75 4.75H20.25M3.75 10H20.25M3.75 15.25H20.25" stroke="white" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <svg width="20" height="20" style='margin-right: 4px;' class='close' viewBox="0 0 26 26"
                            fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.5 19.5L19.5 6.5M6.5 6.5L19.5 19.5" stroke="white" stroke-width="1.5"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </button>
                    <a href="{{ route('public.index') }}" class="">
                        <img src="/images/svg/logo-public.svg" alt="ООО Лилиани">
                    </a>
                </div>
                <div class="flex-grow-1 col align-self-center">
                    <div class="row align-content-center ">
                        <div class="col flex-grow-0 align-self-center">
                            <ul class="main-menu" id='main-menu'>
                                @can('viewAny', [App\Models\Grassland::class, $organisation_id])
                                    <li><a href="{{ route('public.grassland.index') }}">Поля</a></li>
                                @endcan
                                @can('viewAny', [App\Models\Vehicle::class, $organisation_id])
                                    <li><a href="{{ route('public.vehicle.index', ['type' => 'bunker']) }}">Техника</a>
                                        <nav class="submenu">
                                            <ul class="submenu-list">
                                                <li><a href="{{ route('public.vehicle.index', ['type' => 'bunker']) }}">
                                                        Бункеры&nbsp;перегрузчики</a></li>
                                                <li><a href="{{ route('public.vehicle.index', ['type' => 'tractor']) }}">
                                                        Тракторы</a></li>
                                                <li><a
                                                        href="{{ route('public.vehicle.index', ['type' => 'transporter']) }}">
                                                        Грузовики</a></li>
                                                <li><a href="{{ route('public.vehicle.index', ['type' => 'harvester']) }}">
                                                        Комбайны</a></li>
                                            </ul>
                                        </nav>
                                    </li>
                                @endcan
                                @can('viewAny', [App\Models\Employee::class, $organisation_id])
                                    <li><a href="{{ route('public.employee.index') }}">Сотрудники</a></li>
                                @endcan

                                @can('viewAny', [App\Models\User::class, $organisation_id])
                                    <li><a href="{{ route('public.users.index') }}">Пользователи</a></li>
                                @endcan
                            </ul>
                        </div>
                        <div class="col flex-grow-1 align-self-center">
                            <div class="d-flex w-100">
                                <div class="flex-grow-1"></div>

                                <form id="logout-form" class='m-0' action="{{ route('logout') }}" method="POST">
                                    @csrf
                                    <button class="btn btn-link-contrast p-0 bd-0 align-self-center"
                                        type="Sudmit">Выйти</button>
                                </form>
                                <a href='' title='Настройки'
                                    class="organisation-name align-self-center ms-4 d-none d-md-inline">
                                    {{ $organisation }}
                                </a>
                                <i class="organisation-marker align-self-center d-none d-md-inline"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <div id="app" class='d-flex flex-column flex-grow-1'>
        @yield('content')
    </div>
</body>

</html>

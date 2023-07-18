<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body class="">
    <header class="public-header py-2">
        <div class="container-fluid">
            <div class="row align-content-center">
                <div class="flex-grow-0 logo align-self-center">
                    <a href="{{ route('public.index') }}" class="">
                        <img src="./images/svg/logo-public.svg" alt="ООО Лилиани">
                    </a>
                </div>
                <div class="flex-grow-1 col align-self-center">
                    <div class="row align-content-center ">
                        <div class="col flex-grow-0 align-self-center">
                            <ul class="main-menu">
                                <li><a href="">Поля</a></li>
                                <li><a href="">Техника</a></li>
                                <li><a href="">Сотрудники</a></li>
                                <li><a href="{{ route('public.users.index') }}">Пользователи</a></li>
                                <li>
                                    <form id="logout-form" class='m-0' action="{{ route('logout') }}" method="POST">
                                        @csrf
                                        <button class="btn btn-link-contrast p-0 bd-0 align-self-center"
                                            type="Sudmit">Выйти</button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                        <div class="col flex-grow-1 text-end align-self-center">
                            <a href='' title='Настройки' class="organisation-name">
                                {{ $organisation }}
                            </a>
                            <i class="organisation-marker"></i>
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

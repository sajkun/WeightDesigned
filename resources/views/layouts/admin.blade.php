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

<body class="admin">
    <header class="admin-header">
        <div class="container pt-2 pb-2">
            <div class="row  align-items-center">
                <div class="col-5">
                    <img src="./images/svg/logo-admin.svg" alt="">
                </div>
                <div class="col-7 text-end ">
                    <form id="logout-form" action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button class="btn btn-link-contrast" type="Sudmit">Выйти</button>
                    </form>
                </div>
            </div>
        </div>
    </header>
    <div id="app" class='d-flex flex-column flex-grow-1'>
        @yield('content')
    </div>
</body>

</html>

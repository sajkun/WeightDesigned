<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Весовая Система - ООО Лилиани</title>

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>

    @foreach ($jslibs as $url)
        <script src="{{ asset($url) }}" defer></script>
    @endforeach

    <!-- Scripts -->
    <script src="{{ mix('js/manifest.js') }}" defer></script>
    <script src="{{ mix('js/vendor.js') }}" defer></script>
    <script src="{{ mix('js/app.js') }}" defer></script>

    <!-- Styles -->
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
    @if ($useYamap)
        <script src="https://api-maps.yandex.ru/2.1?apikey=164d5998-e082-4c46-9a64-fbb2f9725c6c&load=package.full&lang=ru_RU">
        </script>
        {{-- <script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script> --}}
        <script src="https://yastatic.net/s3/mapsapi-jslibs/area/0.0.1/util.calculateArea.min.js" type="text/javascript">
        </script>
    @endif
</head>

<body class="">
    <header class="public-header py-2">
        <div class="container-fluid">
            <div class="row align-content-center">
                <div class="flex-grow-0 logo align-self-center">
                    <button class="btn btn-link p-0 d-lg-none" type='button' id='mobile-menu-toggle'>
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
                        <div class="col-md-9 align-self-center">
                            <ul class="main-menu" id='main-menu'>
                                @foreach ($menu as $link)
                                    @can('viewAny', [$link['model'], $organisation_id])
                                        <li
                                            @if ($link['icon']) class='ms-md-2 d-flex align-items-center' @endif>
                                            @if ($link['icon'])
                                                <span class="icon-holder none d-md-flex">
                                                    <i class="fa {{ $link['icon'] }}"></i></span>
                                            @endif
                                            <a class='menu-link' title='{{ $link['title'] }}'
                                                href="{{ $link['url'] }}">{{ $link['title'] }}</a>
                                            @if ($link['submenu'])
                                                <nav class="submenu">
                                                    <ul class="submenu-list">
                                                        @foreach ($link['submenu'] as $link_submenu)
                                                            <li><a style='white-space:nowrap'
                                                                    href="{{ $link_submenu['url'] }}">{{ $link_submenu['title'] }}</a>
                                                            </li>
                                                        @endforeach
                                                    </ul>
                                                </nav>
                                            @endif
                                        </li>
                                    @endcan
                                @endforeach
                            </ul>
                        </div>
                        <div class="col-md-3 flex-grow-1 align-self-center">
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

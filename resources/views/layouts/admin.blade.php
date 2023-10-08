<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Весовая Система - ООО Лилиани</title>

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
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-borders-contrast" type='button' data-bs-toggle="modal"
                            data-bs-target="#addOrganisation">Добавить организацию</button>

                        <form id="logout-form" action="{{ route('logout') }}" method="POST">
                            @csrf
                            <button class="btn btn-link-contrast" type="Sudmit">Выйти</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <div id="app" class='d-flex flex-column flex-grow-1'>
        @yield('content')
    </div>

    <div class="modal fade" id="addOrganisation" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form action="{{ route('admin.organisation.store') }}" method='post'>
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Добавить организацию</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        @csrf
                        <div class="form-control-custom">

                            <input id="organisation-name" type="text" class="@error('name') is-invalid @enderror"
                                name="name" value="{{ old('name') }}" required autocomplete="organisation-name"
                                autofocus>

                            <label for="organisation-name"
                                class="@if (old('name')) active @endif">Название
                                организации</label>
                        </div>

                        <div class="form-control-custom mt-2">
                            <input id="tax-number" type="text" class="@error('tax_number') is-invalid @enderror"
                                name="tax_number" value="{{ old('tax_number') }}" required
                                autocomplete="organisation-name" autofocus>

                            <label for="tax-number" class="@if (old('tax_number')) active @endif">ИНН
                                организации</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="submit" class="btn btn-primary-alt">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
<script>
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener('input', e => {

            if (e.srcElement.value) {
                e.target.classList.add('active')
            } else {
                e.target.classList.remove('active')
            }
        })
    });
</script>

</html>

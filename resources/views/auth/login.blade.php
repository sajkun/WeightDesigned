@extends('layouts.app')

@section('content')
    <div class="d-flex flex-column flex-grow-1 justify-content-center">
        <div class="container">
            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul class='p-0'>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            <div class="row justify-content-center">
                <div class="col-md-12">
                    <div class="text-center">
                        <img src="./images/svg/logo-auth.svg" alt="">
                    </div>
                    <div class="form-auth mt-2">
                        <div class="form-auth__header"><b>Вход в учётную запись</b></div>

                        <div class="form-auth__body mt-3">
                            <form method="POST" action="{{ route('login') }}">
                                @csrf
                                <div>
                                    <div class="form-control-custom">

                                        <input id="login" type="text" class=" @error('login') is-invalid @enderror"
                                            name="login" value="{{ old('login') }}" required autocomplete="login"
                                            autofocus minlength="5">

                                        <label for="login"
                                            class="@if (old('login')) active @endif">Логин</label>

                                    </div>
                                    @error('login')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="form-control-custom mt-3">
                                    <input id="password" minlength="8" type="password"
                                        class="@error('password') is-invalid @enderror" name="password" required
                                        data-mode='password' autocomplete="current-password">

                                    <label for="password">Пароль</label>

                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                    <button type='button' id='show-password' class="show-password btn p-2"><i
                                            class="fa fa-eye"></i></button>
                                </div>


                                <div class="mt-3">
                                    <button type="submit" class="btn w-100 btn-primary-alt">
                                        {{ __('Войти') }}
                                    </button>

                                    <div class="mt-4 form-auth__comment">
                                        <p class="m-0">
                                            Если у вас нет логина или пароля, обратитесь по электронному адресу:
                                            <a href="mailto:auth@liliani.ru">auth@liliani.ru</a>
                                        </p>
                                    </div>

                                    <div class="text-center mt-2">

                                        @if (Route::has('password.request'))
                                            <a href="{{ route('password.request') }}">
                                                {{ __('Забыли пароль?') }}
                                            </a>
                                        @endif
                                    </div>

                                    <div class="form-auth__vseparator mt-4">
                                        <div class="d-flex justify-content-center">
                                            <div class="line"></div>
                                            <p class="m-0">Нет аккаунта?</p>
                                            <div class="line"></div>
                                        </div>
                                    </div>

                                    <div class="text-center mt-3">
                                        <a class="btn btn-borders" href="{{ route('register') }}">Регистрация</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

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
@endsection

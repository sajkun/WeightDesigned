@extends('layouts.app')

@section('content')
    <div class="d-flex flex-column flex-grow-1 justify-content-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="text-center">
                        <img src="./images/svg/logo-auth.svg" alt="">
                    </div>
                    <div class="form-auth mt-2">
                        <div class="form-auth__header"><b>Вход в учётную запись</b></div>

                        <div class="form-auth__body mt-3">
                            <form method="POST" action="{{ route('login') }}">
                                @csrf

                                <div>
                                    <label for="login" class="d-none">Логин</label>

                                    <input id="login" type="text"
                                        class="form-control-custom @error('login') is-invalid @enderror" name="login"
                                        value="{{ old('login') }}" required autocomplete="login" placeholder="Логин"
                                        autofocus>

                                    @error('login')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="mt-3">
                                    <label for="password" class="d-none">{{ __('Password') }}</label>

                                    <input id="password" type="password"
                                        class="form-control-custom @error('password') is-invalid @enderror" name="password"
                                        placeholder="пароль" required autocomplete="current-password">

                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
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
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

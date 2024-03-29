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
                        <div class="form-auth__header "><b>Регистрация учётной записи</b></div>
                        <div class="form-auth__body mt-3">
                            <form method="POST" action="{{ route('register') }}">
                                @csrf
                                <div>
                                    <div class="form-control-custom">
                                        <input id="login" type="text" minlength="5"
                                            class="@error('login') is-invalid @enderror" name="login"
                                            value="{{ old('login') }}" required autocomplete="off"
                                            pattern='[A-Za-zА-Яа-яЁё0-9]{5,}'
                                            title='Допустимы только буквы и цифры, минимум 5 символов' autofocus>
                                        <label for="login"
                                            class="@if (old('login')) active @endif">Логин</label>
                                    </div>
                                    <i class='form-control-comment'>
                                        <span>Минимум 5 символов, допустимы только буквы и цифры
                                        </span>
                                    </i>
                                    @error('login')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="mt-3">
                                    <div class="form-control-custom ">
                                        <input id="email" type="email" class="@error('email') is-invalid @enderror"
                                            title='email в формате <foo@bar.com>, допускаются латинские буквы и цифры. Обязательно наличие символов @ и . после точки допускается от 2х до 4х символов'
                                            pattern='[a-z0-9]+@[a-z]+\.[a-z]{2,4}' name="email"
                                            value="{{ old('email') }}" required autocomplete="off">

                                        <label for="email"
                                            class="@if (old('email')) active @endif">E-mail</label>
                                    </div>
                                    <i class='form-control-comment'><span>
                                            Формат электронной почты должен быть в виде:
                                            name@domain.abc
                                        </span></i>

                                    @error('email')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="mt-3">
                                    <div class="form-control-custom">

                                        <input id="organisation-name" type="text"
                                            class="@error('organisation_name') is-invalid @enderror"
                                            name="organisation_name" value="{{ old('organisation_name') }}" required
                                            autocomplete="organisation-name" autofocus>

                                        <label for="organisation-name"
                                            class="@if (old('organisation_name')) active @endif">Название
                                            организации</label>

                                        <div id="dropdown-place-name"></div>
                                    </div>

                                    @error('organisation_name')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>


                                <div class="mt-3">
                                    <div class="form-control-custom">
                                        <input id="tax-number" type="text" minlength="8" pattern='[0-9]{8,}'
                                            title='допустимы только цифры. Минимальная длина - 8 цифр'
                                            class="@error('tax_number') is-invalid @enderror" name="tax_number"
                                            value="{{ old('tax_number') }}" required autocomplete="tax-number" autofocus>

                                        <label for="tax-number" class="@if (old('tax_number')) active @endif">ИНН
                                            организации</label>

                                        <div id="dropdown-place-tax"></div>
                                    </div>
                                    <i class='form-control-comment'><span>Минимум 8 символов, допустимы только
                                            цифры</span></i>

                                    @error('tax_number')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="mt-3">
                                    <div class="form-control-custom">
                                        <input id="password" type="password" data-mode='password'
                                            class="@error('password') is-invalid @enderror" name="password" required
                                            autocomplete="off" minlength="8">

                                        <label for="password">Пароль<span class="password-strength">: <span
                                                    id='passwordStrength'></span></span></span></label>

                                        <button type='button' id='show-password' class="show-password btn p-2"><i
                                                class="fa fa-eye"></i></button>
                                    </div>

                                    <i class='form-control-comment'>
                                        <span>Минимум 8 символов</i>

                                    @error('password')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="form-control-custom  mt-2">
                                    <input id="password-confirm" type="password" class="" name="password_confirmation"
                                        data-mode='password' required autocomplete="off">
                                    <label for="password-confirm">Подтверждение
                                        пароля</label>
                                </div>

                                <div class="mt-4 form-auth__comment">
                                    <p class="m-0">
                                        Если у вас возникли сложности с регистрацией, обратитесь по электронному адресу:
                                        <a href="mailto:auth@liliani.ru">auth@liliani.ru</a>
                                    </p>
                                </div>

                                <div class="mt-3">
                                    <button type="submit" class="btn w-100 btn-primary-alt">
                                        Регистрация
                                    </button>
                                </div>

                                <div class="form-auth__vseparator mt-4">
                                    <div class="d-flex justify-content-center">
                                        <div class="line"></div>
                                        <p class="m-0">Уже зарегистрированы?</p>
                                        <div class="line"></div>
                                    </div>
                                </div>

                                <div class="text-center mt-3">
                                    <a class="btn btn-borders" href="{{ route('login') }}">Авторизоваться</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

@endsection

@section('endbody')
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

    <template id='dropdownWrapper'>
        <div class="dropdown-container">
            <div class="dropdown">

            </div>
        </div>
    </template>
    <template id='dropdownItem'>
        <button class="btn-list-imitation" type='button'>
            <span></span>
        </button>
    </template>
@endsection

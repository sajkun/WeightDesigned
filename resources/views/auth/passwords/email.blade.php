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
                        <img src="{{ URL::to('/') }}/images/svg/logo-auth.svg" alt="">
                    </div>
                    <div class="form-auth mt-2">
                        <div class="form-auth__header "><b>Восстановление учётной записи</b></div>
                        <div class="form-auth__body mt-3">
                            @if (session('status'))
                                <div class="alert alert-success" role="alert">
                                    {{ session('status') }}
                                </div>
                            @endif

                            <form method="POST" action="{{ route('password.email') }}">
                                @csrf

                                <div>
                                    <div class="form-control-custom">

                                        <input id="email" type="email"
                                            class="form-control @error('email') is-invalid @enderror" name="email"
                                            value="{{ old('email') }}" required autocomplete="email" autofocus>
                                        <label class='@if (old('email')) active @endif'
                                            for="email">Email</label>
                                    </div>

                                    @error('email')
                                        <span class="invalid-feedback" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                                </div>

                                <div class="mt-4">

                                    <button type="submit" class="btn w-100 btn-primary-alt">
                                        Восстановить пароль
                                    </button>
                                </div>

                                <div class="form-auth__vseparator mt-4">
                                    <div class="d-flex justify-content-center">
                                        <div class="line"></div>
                                        <p class="m-0">Вспомнили данные?</p>
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

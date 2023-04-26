@extends('layouts.admin')

@section('content')
    <div class="container h-100">
        <div class="row h-100 position-relative">
            <div class="col-lg-6 h-100 p-3">
                <div class="d-lg-flex flex-column org-wrapper h-100">
                    <table class="organisation">
                        <tr>
                            <th>ID</th>
                            <th>название организации</th>
                            <th>ИНН</th>
                        </tr>
                        @foreach ($organisations as $org)
                            <tr>
                                <td onclick='showOrg({{ $org->id }})'>{{ $org->id }}</td>
                                <td onclick='showOrg({{ $org->id }})'>{{ $org->name }}</td>
                                <td onclick='showOrg({{ $org->id }})'>{{ $org->tax_number }}</td>
                                <td>
                                    <form action="{{ route('admin.organisation.destroy', $org->id) }}" method='post'>
                                        @csrf
                                        @method('delete')
                                        <button type='submit' class='btn btn-close'></button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </table>
                </div>
            </div>
            @foreach ($organisations as $org)
                <div class="col-lg-6 p-3 org-details org-ditails-hidden " id="org{{ $org->id }}">
                    <div class="org-wrapper">
                        <header class="org-details__header"><b>{{ $org->name }}</b> {{ $org->tax_number }}</header>

                        <div class="org-details__body mt-3">
                            <nav class="org-details__navigation">
                                <a href="#" class="active">Пользователи</a>
                            </nav>
                        </div>

                        <div>
                            <table class="organisation">
                                <tr>
                                    <th>ID</th>
                                    <th>Логин</th>
                                    <th>Электронная почта</th>
                                </tr>
                                @foreach ($org->users as $user)
                                    <tr>
                                        <td>{{ $user->id }}</td>
                                        <td>{{ $user->login }}</td>
                                        <td>{{ $user->email }}</td>
                                        <td>
                                            <form action="{{ route('admin.user.destroy', $user->id) }}" method='post'>
                                                @csrf
                                                @method('delete')
                                                <button type='submit' class='btn btn-close'></button>
                                            </form>
                                        </td>
                                    </tr>
                                @endforeach
                            </table>
                        </div>

                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <script>
        function showOrg(id) {
            document.querySelectorAll('.org-details').forEach(el => {
                el.classList.add('org-ditails-hidden')
            })

            document.getElementById('org' + id).classList.remove('org-ditails-hidden')
        }
    </script>
@endsection

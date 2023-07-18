@extends('layouts.public')

@section('content')
    <div class="container-fluid">
        <div class="row h-100 position-relative">
            <div class="col-lg-6 col-lg-12 h-100 p-3">
                <div class="d-lg-flex flex-column org-wrapper h-100">
                    <table class="organisation">
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Логин</th>
                                <th>ФИО</th>
                                <th>Роль</th>
                            </tr>
                            @foreach ($users as $user)
                                <tr>
                                    <td>{{ $user->id }}</td>
                                    <td>{{ $user->login }}</td>
                                    <td></td>
                                    <td>{{ $roles[$user->role] }}</td>
                                </tr>
                            @endforeach

                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-lg-6 p-3 org-details org-ditails-hidden" id="org3">
                <div class="org-wrapper">
                    <header class="org-details__header"><b>test org</b> 123456789</header>


                </div>
            </div>

        </div>
    </div>
@endsection

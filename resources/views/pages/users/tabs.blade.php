<nav class="tabs mt-2 col-12">
    <div class="row">
        <ul>
            <li>
                <button class="btn  btn-tab" :class="{ 'active': activeTab === 'info' }" @click="activeTab = 'info'"
                    type='button'>Информация</button>
            </li>
            @can('update', [App\Models\User::class, $organisation_id])
                <li>
                    <button class="btn btn-tab" :class="{ 'active': activeTab === 'settings' }"
                        @click="activeTab = 'settings'" type='button'>Настройки</button>
                </li>
            @endcan
        </ul>
    </div>
</nav>

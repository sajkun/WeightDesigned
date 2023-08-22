<nav class="tabs mt-2">
    <div class="row">
        <ul>
            <li>
                <button class="btn  btn-tab" :class="{ 'active': activeTab === 'info' }" @click="activeTab = 'info'"
                    type='button'>Информация</button>
            </li>
            <li>
                <button class="btn btn-tab" :class="{ 'active': activeTab === 'activity' }"
                    @click="activeTab = 'activity'" type='button'>Активность</button>
            </li>
            <li>
                <button class="btn btn-tab" :class="{ 'active': activeTab === 'settings' }"
                    @click="activeTab = 'settings'" type='button'>Настройки</button>
            </li>
        </ul>
    </div>
</nav>

{{-- Часть страницы просмотра поля. отображение поля для пользователей, не имеющих права его редактировать --}}
<div class="row narrow-row">
    <div class="col-12 col-md-6 mt-2 form-control-custom">
        <input type="text" v-model='grasslandToEdit.name' readonly id='grasslandName' name='name' ref='grasslandName'
            required key='grasslandName'>
        <label :class="{ 'active': grasslandToEdit.name }" for="grasslandName">Название</label>
    </div>
    <div class="col-12 col-md-6 mt-2  form-control-custom">
        <input type="text" id='grasslandSize' name='size' v-model='grasslandToEdit.size' ref='grasslandSize'
            readonly required key='grasslandSize'>
        <label :class="{ 'active': grasslandToEdit.size }" for="grasslandSize">Размер поля
            (га)</label>
    </div>
    <div class="col-12 mt-2  form-control-custom">
        <input type="text" id='grasslandCulture' name='size' v-model='grasslandToEdit.size' ref='grasslandCulture'
            readonly required key='grasslandCulture'>
        <label for="grasslandCulture" class='active'>Культура</label>
    </div>
</div>
<div class="text-end mt-2">
    <button class="btn btn-borders-grey" type='button' @click='mode="list"'>Закрыть</button>
</div>

{{-- блок карты --}}
{{-- ------------------------- --}}
<div class="col-12 col-md-6 " ref='observeResize'>
    <div class="h-100 d-flex flex-column pb-2" :ref='"fixposition"'>
        <Transition name="fade">
            <div v-if='showMap' id='map-container' ref='map-container' class='flex-grow-1'></div>
        </Transition>
    </div>
</div>
{{-- ------------------------- --}}

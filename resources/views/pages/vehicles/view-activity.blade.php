<div class="" v-if='activeTab=== "activity"'>
    <bvs-operation :_info='info' :key='"operation" + key' v-for='info,key in bvsOperations'
        :class='"mt-2"'>
    </bvs-operation>
</div>

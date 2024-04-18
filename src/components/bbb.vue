<template>
    <div class="bbb" >
        <div v-if="column.children">
            <template v-for="(colItem, index) in column.children">
                <BbbCC :column="colItem" :key="index">
                    <template v-for="(slotname) in colItem.slotname" v-slot:[slotname]>
                        <slot :name="slotname"></slot> 
                    </template>
                </BbbCC>
            </template>
        </div>
        <div v-if="column.colType === 'slot'">
            <slot :name="column.prop" />    
        </div>
        <div v-else>
            ===
        </div>
        <!-- <slot v-if="someCondition" name="bbb"></slot> 
        <BbbCC v-if="someCondition">
            <template #bbb>
                <slot name="bbb"></slot> 
            </template>
        </BbbCC> -->
    </div>
</template>

<script>
export default {
name: 'BbbCC',
components: {
},
props: {
    column: {
      type: Object,
      default: () => {},
    },
},
data() {
    return {
    }
},
mounted() {

},
methods: {

},
};
</script>
<style scoped>
</style>
  
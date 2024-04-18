<template>
    <div class="aaa" >
        <div v-for="(colItem, index) in columns" :key="index">
            <bbb :column="colItem">
                <template v-for="(slotname) in colItem.slotname" v-slot:[slotname]>
                  <slot :name="slotname"></slot> 
                </template>
            </bbb>
        </div>
    </div>
  </template>
  
  <script>
  import bbb from '@/components/bbb.vue'
  export default {
    name: "AaaCC",
    components: {
      bbb
    },
    props: {
        columns: {
            type: Array,
            default: () => [],
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
  .table_box{
    width: 700px;
    -webkit-user-select: none; /* Chrome, Safari, Android */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* 标准语法 */
  }
  </style>
  
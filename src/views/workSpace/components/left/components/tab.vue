<template>
    <div class="sideSet">
      <div
        v-for="(item, index) in list"
        :key="index"
        :class="['sideSet-tab', active(item.key) ? 'active' : '']"
        @click="changeTab(item.key)"
      >
        <!-- <svgIcon
          :name="item.icon"
          :color="active(item.key) ? '#ffffff' : '#000000'"
          :size="18"
        ></svgIcon> -->
        <div>{{item.icon}}</div>
      </div>
    </div>
  </template>
  
  <script>
  import Vue from "vue";
  export default Vue.extend({
    props: {
      tabKey: String,
      list: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      active() {
        return (key) => {
          return this.tabKey === key;
        };
      },
    },
    methods: {
      changeTab(type) {
        this.$emit("changeTab", type);
      },
    },
  });
  </script>
  
  <style scoped>
  .sideSet {
    position: relative;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #f1e8e8;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .sideSet-tab {
    width: 40px;
    height: 100%;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sideSet-tab:hover {
    cursor: pointer;
    color: #409eff;
  }
  .sideSet-tab:active {
    background-color: #f6f7ff;
  }
  .sideSet .active {
    color: #fff !important;
    background-color: #ff44aa;
  }
  .sideSet-refresh {
    display: flex;
    position: absolute;
    top: 50%;
    right: 5px;
    height: 100%;
    align-items: center;
    transform: translateY(-50%);
    font-size: 18px;
  }
  .sideSet-refresh .left-icon-tab {
    width: 28px;
    height: 28px;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sideSet-refresh .active-ic {
    color: #fff !important;
    background-color: #409eff;
  }
  .sideSet-refresh .refreshIcon:hover {
    cursor: pointer;
    color: #409eff;
  }
  </style>
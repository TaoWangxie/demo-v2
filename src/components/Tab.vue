<template>
    <div class="custom-tabs">
      <!-- <div class="custom-tabs-nav"> -->
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="custom-tabs-tab"
        :class="{ 'custom-tabs-tab-active': activeIndex === index }"
        @click="handleTabClick(index)"
      >
        {{ tab.label }}
      </div>
      <!-- </div> -->
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        activeIndex: 0,
      };
    },
    props: {
      tabs: {
        type: Array,
        default: () => [],
      },
    },
    methods: {
      handleTabClick(index) {
        if (this.activeIndex !== index) {
          this.activeIndex = index;
          this.$emit("change", index);
        }
      },
    },
  };
  </script>
  
    
  <style lang="scss" scoped>
  $n: 1rem/32;
  .custom-tabs {
    display: flex;
    height: 100%;
    background-color: #fff;
    color: #000000;
    overflow-x: auto;
  }
  .custom-tabs-tab {
    display: flex;
    flex: 1;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 12 * $n;
    font-size: 26 * $n;
    cursor: pointer;
    border-bottom: 2 * $n solid #fff;
    box-sizing: border-box;
  }
  
  .custom-tabs-tab-active {
    font-weight: bold;
    border-bottom: 2 * $n solid #1acb97;
  }
  
  .custom-tabs-content {
    flex: 1;
    overflow-y: auto;
  }
  </style>
      
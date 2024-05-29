<template>
  <div class="left_container">
    <div class="left_content">
      <Tab :list="tabList" :tabKey="configTab" @changeTab="changeTab"></Tab>
      <Coms v-show="configTab === 'coms'"></Coms>
    </div>
  </div>
</template>
<script>
import Tab from './components/tab'
import Coms from './components/coms'
export default {
    name: "LeftContainer",
    components: {
      Tab,
      Coms
    },
    data() {
        return {
          configTab: "coms",
          tabList:[
            {
              key: "coms",
              icon: "com",
            },
            {
              key: "layer",
              icon: "layer",
            },
          ]
        };
    },
    methods:{
      changeTab(val){
        this.configTab = val;
      },
    }
};
</script>

<style lang="scss" scoped>
.left_container {
  width: 240px;
  height: 100%;
  z-index: 1;
  flex-shrink: 0;
}
.left_content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #e4e7ed;
}
</style>
  
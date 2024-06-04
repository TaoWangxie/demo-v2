<template>
  <div class="layout">
    <!--顶部导航-->
    <Nav></Nav>
    <div class="container">
      <!--左侧导航-->
      <Side></Side>
      <div class="main">
        <!--主主体-->
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="el-fade-in" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/Layout/components/nav";
import Side from "@/Layout/components/side";
export default {
  name: 'LayoutA',
  components: {
    Nav,
    Side
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;

  .container {
    display: flex;
    height: calc(100vh - 50px);
    overflow: hidden;
    background-color: #F5F7FA;

    .main {
      flex: 1;
      width: 0;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .content {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
      }
    }
  }
}
</style>

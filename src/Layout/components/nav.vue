<template>
    <div class="nav-bar">
      <div class="logo">
        demo-v2
      </div>
      <div class="action" @click="action">
        <div class="btn" data-btn="0">工作台</div>
      </div>
    </div>
</template>
<script>
export default {
    name: "NavBar",
    components: {},
    methods:{
      action(event) {
        let btnStatus = event.target.getAttribute("data-btn");
        switch (btnStatus) {
          case "0":
            this.$router.push({
              path: "/workSpace",
              query: {},
            });
            break;
        }
      },
    }
};
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  height: 50px;
  padding: 0 25px;
  box-sizing: border-box;
  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2);
  z-index: 1;
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    color: #626aef;
  }
  .icon {
    margin-right: 12px;
  }
  .action{
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
    .btn{
      margin-left: 10px;
      &:hover{
        cursor: pointer;
        color: #626aef;
      }
    }
  }
}
</style>
  
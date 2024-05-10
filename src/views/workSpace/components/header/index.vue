<template>
    <div class="header">
      <div class="logo" @click="goHome">
        工作台
      </div>
    </div>
</template>
<script>
export default {
    name: "HeaderBar",
    components: {},
    methods:{
        goHome(){
            this.$router.push('/home');
        }
    }
};
</script>

<style lang="scss" scoped>
.header {
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
}
</style>
  
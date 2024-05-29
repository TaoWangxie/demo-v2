<template>
    <div class="workSpace">
        <Left></Left>
    </div>
</template>

<script>
import Left from './components/left'
export default {
    name: "WorkSpace",
    components: {
        Left
    },
};
</script>

<style scoped>
.workSpace{
  width: 100%;
  height: 100vh;
  display: flex;
  overflow-x: hidden;
}
</style>

<template>
  <div class="Demo">
    <BaiduMap></BaiduMap>
  </div>
</template>

<script>
import BaiduMap from "./BaiduMap.vue";
export default {
  name: "DemoPage",
  components: {
    BaiduMap,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.Demo {
  height: 100%;
}
</style>

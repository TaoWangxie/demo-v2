<template>
    <div class="MyHome">
        1111
        <BaiduMap class="bm-view" ak="03EV2mS83xtLoifvHnRm5MTx5krHDIg0">
  </BaiduMap>
    </div>


</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
export default {
    name: "MyHome",
    components: {
        BaiduMap
    },
};
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 300px;
}
</style>

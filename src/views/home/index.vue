<template>
  <div class="MyHome">
    <baidu-map class="bmiew" center="中国">
      <bml-marker-clusterer :averageCenter="true">
        <bm-marker
          v-for="(marker, index) of markers"
          :key="index"
          :position="{ lng: marker.lng, lat: marker.lat }"
        ></bm-marker>
      </bml-marker-clusterer>
    </baidu-map>
  </div>
</template>

<script>
import { BaiduMap, BmlMarkerClusterer, BmMarker } from "vue-baidu-map";
export default {
  name: "MyHome",
  components: {
    BaiduMap,
    BmlMarkerClusterer,
    BmMarker,
  },
  data() {
    // 插入 10 个随机点
    const markers = [];
    for (let i = 0; i < 10; i++) {
      const position = {
        lng: Math.random() * 40 + 85,
        lat: Math.random() * 30 + 21,
      };
      markers.push(position);
    }
    return {
      markers,
    };
  },
};
</script>

<style scoped>
.bmiew {
  width: 100%;
  height: 600px;
}
</style>

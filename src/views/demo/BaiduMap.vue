<template>
  <div class="BaiduMap">
    <baidu-map class="bmiew" center="中国" @zoomend="zoomend">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bml-marker-clusterer :averageCenter="true">
        <bm-marker
          v-for="(marker, index) of markers"
          :key="index"
          :data-marker="index"
          :position="{ lng: marker.lng, lat: marker.lat }"
          :title="`marker_point_${index}`"
        >
          <bm-overlay
            ref="customOverlay"
            :class="{
              sample: true,
              active,
              isshow: list.includes(`marker_point_${index}`),
            }"
            pane="labelPane"
            :title="`marker_point_${index}`"
            @draw="draw($event, { lng: marker.lng, lat: marker.lat })"
          >
            <div>标题：{{ marker.name }}</div>
            <div class="btn" @click="btnClick(marker)">按钮</div>
          </bm-overlay>
        </bm-marker>
      </bml-marker-clusterer>
    </baidu-map>
  </div>
</template>

<script>
import { BaiduMap, BmlMarkerClusterer, BmMarker } from "vue-baidu-map";
export default {
  name: "BaiduMapCom",
  components: {
    BaiduMap,
    BmlMarkerClusterer,
    BmMarker,
  },
  data() {
    return {
      markers: [
        {
          name: "111",
          lng: 116.404,
          lat: 39.915,
        },
        {
          name: "222",
          lng: 118.404,
          lat: 39.915,
        },
        {
          name: "333",
          lng: 116.404,
          lat: 42.915,
        },
        {
          name: "444",
          lng: 116.404,
          lat: 35.915,
        },
      ],
      show: false,
      position: {},
      active: false,
      list: [],
    };
  },
  methods: {
    btnClick(data) {
      console.log(data.name);
    },
    draw({ el, BMap, map }, position) {
      const { lng, lat } = position;
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat));
      el.style.left = pixel.x - 60 + "px";
      el.style.top = pixel.y - 20 + "px";
    },
    zoomend() {
      this.$nextTick(() => {
        this.list = [];
        let bmiewDiv = document.querySelector(".bmiew");
        let BMapMarkers = bmiewDiv.querySelectorAll(".BMap_Marker");
        BMapMarkers.forEach((item) => {
          let title = item.getAttribute("title");
          if (
            title &&
            title.includes("marker_point") &&
            !this.list.includes(title)
          ) {
            this.list.push(title);
          }
        });
      });
    },
  },
};
</script>
<style scoped>
.BaiduMap {
  .bmiew {
    width: 100%;
    height: 600px;
  }
  .sample {
    display: none;
    width: 90px;
    background: #fff;
    font-size: 12px;
    overflow: hidden;
    box-shadow: 0 0 5px #ccc;
    padding: 5px;
    position: absolute;
  }
  .isshow {
    display: block;
  }
  .sample.active {
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
  }
  .btn {
    padding: 4px 6px;
    background-color: #409eff;
    text-align: center;
    color: #fff;
  }
}
</style>

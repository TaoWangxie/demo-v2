<template>
  <div class="ImMap" @click="goToBaiduMap">
    <div class="ImMap_header">
      <div class="ImMap_title">111</div>
      <div class="ImMap_info">22222</div>
    </div>
    <div class="ImMap_map">
      <img src="" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ImMap",
  components: {},
  data() {
    return {};
  },
  methods: {
    goToBaiduMap() {
      // 定义地图坐标
      var latitude = 40.7128; // 纬度
      var longitude = -74.006; // 经度
      // 构建百度地图链接
      var mapUrl =
        "https://map.baidu.com/?latlng=" + latitude + "," + longitude;

      // 在新标签中打开百度地图链接
      window.open(mapUrl, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.ImMap {
  width: 300px;
  //   height: 160px;
  background-color: #fff;
  .ImMap_header {
    padding: 10px;
    text-align: left;
  }
  .ImMap_title {
    line-height: 22px;
    font-size: 15px;
    font-weight: 500;
  }
  .ImMap_info {
    line-height: 18px;
    font-size: 12px;
    color: #a8abb2;
  }
  .ImMap_map {
    height: 120px;
    background-color: #e6e8eb;
  }
}
</style>

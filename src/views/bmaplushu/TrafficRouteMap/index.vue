<template>
  <div class="TrafficRouteMap" v-loading="loading">
    <div id="allmap"></div>
    <div v-if="pathData.length" class="actionBox">
      <div class="part">
        <img
          v-if="!isShowFilter"
          class="controls_img"
          src="/static/images/trafficMap/filter.png"
          alt=""
          @click="openFilter(true)"
        />
        <img
          v-else
          class="controls_img"
          src="/static/images/trafficMap/filter_active.png"
          alt=""
          @click="openFilter(false)"
        />
        <div v-show="isShowFilter" class="filterBox">
          <div class="filter_li">
            <div class="label">点位展示</div>
            <div class="value">
              <el-checkbox-group style="display: flex" v-model="checkList">
                <el-checkbox label="1">停车</el-checkbox>
                <el-checkbox label="2">充电</el-checkbox>
                <el-checkbox label="3">加油</el-checkbox>
                <el-checkbox label="4">违章</el-checkbox>
                <el-checkbox label="5">维保出厂</el-checkbox>
                <el-checkbox label="6">事故出厂</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="filter_li">
            <div class="label"></div>
            <div class="value">
              <div class="colorInfo">
                <span style="background: #0062ff"></span>内部用车
              </div>
              <div class="colorInfo">
                <span style="background: #15cf8b"></span>未下单
              </div>
              <div class="colorInfo">
                <span style="background: #ff3363"></span>异常用车
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="controls part">
        <div>
          <img
            class="controls_img"
            v-if="!isGo"
            src="/static/images/trafficMap/play.png"
            alt=""
            @click="startLushu"
          />
          <img
            class="controls_img"
            v-else
            src="/static/images/trafficMap/pause.png"
            alt=""
            @click="pauseLushu"
          />
        </div>
        <div class="slider">
          <el-slider
            v-model="processValue"
            :min="0"
            :max="maxProcess"
            style="flex: 1"
            @change="onProcessChange"
          >
          </el-slider>
        </div>
        <div>
          <img
            class="controls_img"
            src="/static/images/trafficMap/stop.png"
            alt=""
            @click="stopLushu"
          />
        </div>
        <div class="speed">
          <el-dropdown trigger="click" @command="onSpeedChange">
            <span>
              倍速 {{ indexText
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in dropdownArr"
                :command="item"
                :key="index"
                >{{ item.text }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="tabBox">
      <div
        v-for="(item, index) in radioList"
        :key="index"
        :class="['tabItem', currentSelect === index ? 'active' : '']"
        @click="handleTab(index)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
import { TrafficRouteMap } from "./utils/TrafficRouteMap.js";
export default {
  name: "TrafficRouteMap",
  data() {
    return {
      loading: false,
      trafficMap: null,
      pathData: [],
      markers: [],
      processValue: 0, // 进度滑块初始值
      maxProcess: 0, // 进度滑块最大值，将在初始化时设置
      isGo: false, // 播放状态
      // 小车行进的速度
      dropdownArr: [
        { text: "x0.5", speed: 100 },
        { text: "x0.75", speed: 150 },
        { text: "x1", speed: 200 },
        { text: "x2", speed: 400 },
        { text: "x3", speed: 600 },
        { text: "x5", speed: 1000 },
      ],
      indexText: "x1",
      speedValue: 200, // 初始速度
      // 复选框
      isShowFilter: false,
      checkList: [],
      // tab切换
      radioList: ["用车订单分析", "驾驶行为分析"], // 选项数据
      currentSelect: 0, // 当前选中的索引，默认选第一个
      //当前城市信息
      cityInfo: {
        province: "",
        city: "",
        lng: "",
        lat: "",
      },
    };
  },
  created() {
    // 获取经纬度省市信息
    // this.getLocation();
  },
  mounted() {
    // 确保 DOM 已加载完成
    this.$nextTick(() => {
      this.initMap();
      this.getCarMarkers();
    });
  },
  beforeDestroy() {
    // 组件销毁前清理地图资源
    if (this.trafficMap && typeof this.trafficMap.destroy === "function") {
      this.trafficMap.destroy();
    }
  },
  methods: {
    // 调用浏览器定位API
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { longitude, latitude } = position.coords;
            if (longitude && latitude) {
              this.cityInfo.lng = longitude;
              this.cityInfo.lat = latitude;
              let point = { lng: longitude, lat: latitude };
              this.reverseGeocode(point); // 触发逆地理编码
            }
          },
          (error) => {
            let msg = "";
            switch (error.code) {
              case 1:
                msg = "用户拒绝了位置请求";
                break;
              case 2:
                msg = "无法获取位置信息";
                break;
              case 3:
                msg = "请求超时";
                break;
              default:
                msg = "未知错误";
                break;
            }
            console.error("定位失败:", msg);
          },
          { enableHighAccuracy: true, timeout: 5000 } // 高精度+超时设置
        );
      } else {
        alert("您的浏览器不支持地理定位功能！");
      }
    },
    // 将经纬度转换为省市信息
    reverseGeocode(point) {
      const geocoder = new BMap.Geocoder();
      geocoder.getLocation(
        new BMap.Point(point.lng, point.lat),
        (result) => {
          if (result) {
            const { province, city } = result.addressComponents;
            if (province && city) {
              this.cityInfo.province = province;
              this.cityInfo.city = city;
              console.log(`当前位置:`, this.cityInfo);
            }
          }
        },
        { poiRadius: 1000 } // 搜索半径（米）
      );
    },
    // 首屏获取所有车辆标记点
    getCarMarkers() {
      this.loading = true;
      setTimeout(() => {
        let points = [
          { path: "108.741619,34.350293" },
          { path: "108.738996,34.349034" },
          { path: "108.736598,34.345368" },
          { path: "108.733795,34.343736" },
          { path: "108.743029,34.344556" },
          { path: "108.731585,34.34092" },
          { path: "108.736831,34.356358" },
          { path: "108.719009,34.356001" },
          { path: "108.74991,34.322974" },
          { path: "108.6705,34.339191" },
          { path: "108.700827,34.312419" },
          { path: "108.700827,34.312419" },
          { path: "108.715487,34.33624" },
          { path: "108.713978,34.334496" },
          { path: "108.699983,34.333021" },
          { path: "108.693138,34.353438" },
        ];
        this.loading = false;
        if (points.length) {
          let icon =
            "https://sqzl-img.oss-cn-beijing.aliyuncs.com/pc/online/confirmPic/985501a6d113416b.png";
          this.trafficMap.drawMarkerClusterer(
            points,
            icon,
            (value) => {
              this.getTrack(value);
              this.getlLabelsAndMarkers();
            },
            { lng: this.cityInfo.lng, lat: this.cityInfo.lat },
            11
          );
        }
      }, 1000);
    },
    // 获取车辆轨迹
    getTrack(id) {
      console.log(id);
      this.loading = true;
      setTimeout(() => {
        this.pathData = [
          { id: 1, path: "113.408984,23.174023", color: "#0062FF", type: "" },
          { id: 2, path: "113.406639,23.174023", color: "#0062FF", type: "" },
          { id: 3, path: "113.403944,23.173566", color: "#0062FF", type: "1" },
          { id: 4, path: "113.400827,23.17394", color: "#0062FF", type: "" },
          { id: 5, path: "113.397468,23.174496", color: "#15CF8B", type: "2" },
          { id: 6, path: "113.391494,23.174513", color: "#15CF8B", type: "6" },
          { id: 7, path: "113.389032,23.174588", color: "#15CF8B", type: "5" },
          { id: 8, path: "113.388736,23.173217", color: "#15CF8B", type: "" },
          { id: 9, path: "113.388511,23.171888", color: "#FF3363", type: "3" },
          { id: 10, path: "113.388592,23.170501", color: "#FF3363", type: "" },
          { id: 11, path: "113.38861,23.170219", color: "#FF3363", type: "4" },
          { id: 12, path: "113.38861,23.168342", color: "#FF3363", type: "" },
          { id: 13, path: "113.388574,23.165218", color: "#FF3363", type: "" },
        ];
        this.loading = false;
        if (this.pathData.length) {
          this.trafficMap.clearAllMarkers();
          this.trafficMap.map.centerAndZoom(
            new BMap.Point(113.400827, 23.17394),
            16
          );
          // 设置进度滑块最大值
          this.maxProcess = this.pathData.length - 1;
          // 绘制路径
          this.trafficMap.drawPath(this.pathData, (point) => {
            this.getPathPointDetail(point, this.pointData);
          });
          // 初始化路书
          this.trafficMap.initLushu({ speed: this.speedValue });
          // 添加开始结束标注点
          this.trafficMap.drawStartEndMarkers(this.pathData);
        }
      }, 1000);
    },
    // 获取路径点详情
    getPathPointDetail(point, pointData) {
      console.log(point, pointData);
      this.loading = true;
      setTimeout(() => {
        const infoContent = `
          <div class="infobox-container">
              <div class="header">
                  <div class="title">
                      <div class="tag">内部用车</div>
                      <div class="time">2025/05/15 09:40-2025/05/15 12:30</div>
                  </div>
                  <div class="close_infoWindow"></div>
              </div>
              <div class="content">
                  <div class="car-order-content">
                      <div>
                          <img src="/static/images/trafficMap/driver.png" alt="">
                          <span>李建国/13672080809</span>
                      </div>
                      <div>
                          <img src="/static/images/trafficMap/carUser.png" alt="">
                          <span>欧阳春雪/13672080809</span>
                      </div>
                  </div>
                  <div class="car-order-timeline">
                      <div class="timeline_li">
                          <img src="/static/images/trafficMap/startingPoint.png" alt=""/>
                          简直的维修厂001
                      </div>
                      <div class="timeline_line"></div>
                      <div class="timeline_li">
                          <img src="/static/images/trafficMap/keyPoint.png" alt=""/>
                          简直的维修厂001
                      </div>
                  </div>
                  <div class="car-order-total">
                      <div class="car-order-total-item">
                          <div>
                              <span class="car-order-total-item-num">420.5</span>
                              <span class="car-order-total-item-unit">km</span>
                          </div>
                          <div class="car-order-total-item-title">
                              里程
                          </div>
                      </div>
                      <div class="car-order-total-item">
                          <div>
                              <span class="car-order-total-item-num">4.25</span>
                              <span class="car-order-total-item-unit">h</span>
                          </div>
                          <div>
                              时长
                          </div>
                      </div>
                  </div>
              </div>
          </div>`;
        this.loading = false;
        this.trafficMap.openInfoBox(point, infoContent);
      }, 500);
    },
    // 获取标签和标注点
    getlLabelsAndMarkers() {
      setTimeout(() => {
        this.markers = [
          { id: 1, path: "113.403944,23.173566", color: "#0062FF", type: "1" },
          { id: 2, path: "113.397468,23.174496", color: "#15CF8B", type: "2" },
          { id: 3, path: "113.391494,23.174513", color: "#15CF8B", type: "6" },
          { id: 4, path: "113.389032,23.174588", color: "#15CF8B", type: "5" },
          { id: 5, path: "113.388511,23.171888", color: "#FF3363", type: "3" },
          { id: 6, path: "113.38861,23.170219", color: "#FF3363", type: "4" },
        ];
        // 添加文本标注点
        const drawPonts = this.markers.filter(
          (item) => item.type && item.type != "6"
        );
        this.trafficMap.drawLabel(drawPonts, (point, labelData) => {
          this.getLabelDetail(point, labelData);
        });
        // 添加停车点
        const stopMarkers = this.markers.filter((item) => item.type == "6");
        this.trafficMap.drawMarkers(
          stopMarkers,
          "/static/images/trafficMap/p.png"
        );
      }, 1000);
    },
    // 获取标签详情
    getLabelDetail(point, labelData) {
      console.log(point, labelData);
      this.loading = true;
      setTimeout(() => {
        const infoContent = `<div class="infobox-container">
                <div class="header">
                    <div class="title">
                        <div class="tag">内部用车</div>
                        <div class="time">2025/05/15 09:40-2025/05/15 12:30</div>
                    </div>
                    <div class="close_infoWindow"></div>
                </div>
                <div class="content">
                    <div class="content_li">
                        <div class="label">驾驶员</div>
                        <div class="value">李建国/13567890322</div>
                    </div>
                    <div class="content_li">
                        <div class="label">违章地点</div>
                        <div class="value">北京市海淀区交东路31号院向东100米处</div>
                    </div>
                    <div class="content_li">
                        <div class="label">罚分罚款</div>
                        <div class="value">3分 ¥200</div>
                    </div>
                </div>
            </div>`;
        this.loading = false;
        this.trafficMap.openInfoBox(point, infoContent);
      }, 500);
    },

    // 初始化地图
    initMap() {
      this.trafficMap = new TrafficRouteMap("allmap", {
        zoomLevel: 16,
        sliderFn: (value) => {
          this.processValue = value;
        },
      });
    },
    // 开始、暂停、停止路书
    startLushu() {
      if (this.trafficMap) {
        this.isGo = true;
        this.trafficMap.startLushu();
      }
    },
    // 暂停路书
    pauseLushu() {
      if (this.trafficMap) {
        this.isGo = false;
        this.trafficMap.pauseLushu();
      }
    },
    // 停止路书
    stopLushu() {
      if (this.trafficMap) {
        this.isGo = false;
        this.trafficMap.stopLushu();
        this.processValue = 0; // 重置进度
      }
    },
    // 监听路书播放状态
    onSpeedChange(value) {
      this.indexText = value.text;
      this.speedValue = value.speed;
      // 更新路书速度
      if (this.trafficMap && this.trafficMap.lushu) {
        this.trafficMap.lushu._opts.speed = this.speedValue;
      }
    },
    // 监听进度滑块变化
    onProcessChange(value) {
      // 更新路书进度
      if (this.trafficMap && this.trafficMap.lushu) {
        if (this.trafficMap.lushu.i < value) {
          // 快进：如果滑动条的进度大于路书当前的进度，则不允许
          this.processValue = this.trafficMap.lushu.i;
        } else {
          // 后退：更新路书位置
          this.trafficMap.lushu.i = value;
        }
        // 到达终点时暂停
        if (value === this.maxProcess) {
          this.pauseLushu();
        }
      }
    },
    // 监听复选框变化
    openFilter(flag) {
      this.isShowFilter = flag;
    },
    // tab切换
    handleTab(index) {
      this.currentSelect = index;
      if (index === 0) {
      } else {
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.TrafficRouteMap {
  position: relative;
  .actionBox {
    position: absolute;
    left: 18px;
    bottom: 18px;
    display: flex;
  }
  .part {
    position: relative;
    display: flex;
    align-items: center;
    height: 34px;
    background: rgba(255, 255, 255, 0.8);
    padding: 2px 12px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    margin-right: 16px;
  }
  .filterBox {
    position: absolute;
    bottom: 130%;
    left: 0;
    padding: 24px 20px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    .filter_li {
      display: flex;
      padding-bottom: 20px;
      &:last-child {
        padding-bottom: 0;
      }
      .label {
        width: 70px;
        font-size: 12px;
        color: #333;
        line-height: 18px;
        font-weight: 400;
      }
      .value {
        display: flex;
        align-items: center;
        flex: 1;
      }
      .colorInfo {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-right: 24px;
        color: #9a9a9a;
        span {
          display: inline-block;
          width: 16px;
          height: 6px;
          border-radius: 3px;
          margin-right: 6px;
        }
      }
    }
  }
  .controls_img {
    display: inline-block;
    width: 20px;
    height: 20px;
    &:hover {
      cursor: pointer;
    }
  }
  .controls {
    .slider {
      display: flex;
      align-items: center;
      width: 200px;
      padding: 0 15px;
    }
    .speed {
      border-radius: 4px;
      border: 1px solid #2854c8;
      margin-left: 15px;
      &:hover {
        cursor: pointer;
      }
      span {
        font-size: 12px;
        color: #2854c8;
        line-height: 18px;
        padding: 0 8px;
      }
    }
  }
  .tabBox {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 18px;
    display: flex;
    align-items: center;
    border: 1px solid #2854c8;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.3);
    font-size: 12px;
    font-weight: 600;
    height: 34px;
    .tabItem {
      height: 100%;
      line-height: 34px;
      padding: 0 12px;
      background-color: #fff;
      cursor: pointer;
    }
    .active {
      background-color: #2854c8;
      color: #fff;
      border-color: #2854c8;
    }
  }
}
</style>
<style lang="scss">
.TrafficRouteMap {
  .el-slider__button {
    width: 12px !important;
    height: 12px !important;
  }
  #allmap {
    width: 100%;
    height: calc(100vh - 60px);
  }
  // 自定义信息窗口样式
  .infobox-container {
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    padding: 10px 16px 16px 16px;
    width: 350px;
    background-color: #fff;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
      .title {
        display: flex;
        align-items: center;
      }
      .tag {
        border-radius: 5px;
        font-size: 12px;
        color: #fff;
        padding: 5px 8px;
        margin-right: 10px;
        background-color: #0062ff;
      }
      .time {
        font-size: 12px;
        color: #9a9a9a;
      }
      .close_infoWindow {
        display: inline-block;
        cursor: pointer;
        width: 20px;
        height: 20px;
        background: #ccc;
      }
    }
    .content {
      .car-order-content {
        margin: 12px 0 16px 0;
        img {
          width: 16px;
          vertical-align: text-bottom;
        }
        div {
          width: 49%;
          display: inline-block;
          height: 18px;
          font-weight: 400;
          font-size: 12px;
          color: #333333;
          line-height: 18px;
        }
      }
      .car-order-timeline {
        margin-left: 3px;
        margin-bottom: 16px;
        .timeline_li {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #333333;
        }
        .timeline_line {
          height: 16px;
          border-left: 1px dashed #979797;
          margin-left: 4px;
        }
        img {
          width: 10px;
          margin-right: 5px;
        }
      }
      .car-order-total {
        margin: 10px 0;
        .car-order-total-item {
          width: 49%;
          text-align: center;
          display: inline-block;
          .car-order-total-item-num {
            margin: 0 4px 2px 0;
            font-weight: bold;
            font-size: 20px;
            color: #000000;
            line-height: 27px;
          }
          .car-order-total-item-unit {
            font-weight: 500;
            font-size: 12px;
            color: #9a9a9a;
            line-height: 18px;
          }
          .car-order-total-item-title {
            font-weight: 400;
            font-size: 12px;
            color: #9a9a9a;
            line-height: 18px;
            font-style: normal;
          }
        }
      }
      .content_li {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-top: 16px;
        .label {
          width: 70px;
          color: #9a9a9a;
        }
        .value {
          flex: 1;
          color: #333333;
        }
      }
    }
  }
  // 自定义标注点样式
  .close_infoWindow {
    //background: url("../../../../assets/images/close_bg.png") no-repeat center center !important;
    background-size: 90% 90% !important;
  }
  // 自定义信息窗口样式
  .labelBox {
    .text {
      padding: 20px 25px 24px 60px;
      font-size: 12px;
      font-weight: 500;
    }
  }

  /* 隐藏所有装饰性元素 */
  .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(1),  /* 左上角 */
    .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(2),  /* 顶部边框 */
    .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(3),  /* 右上角 */
    .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(4),  /* 右侧边框 */
    .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(5),  /* 底部边框 */
    .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(6),  /* 左下角 */
    .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(7),
    .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(8) {
    /* 箭头容器 */
    display: none !important;
  }
  .BMap_pop.TrafficRouteMap_infoWindow > div:nth-child(9) {
    padding: 15px !important;
    width: auto !important;
    height: auto !important;
  }
  .TrafficRouteMap_infoWindow img[src*="iw_close"] {
    display: none !important;
  }
  /* 禁用按钮点击事件（防止残留区域响应） */
  .TrafficRouteMap_infoWindow .BMap_close {
    pointer-events: none !important;
  }
}
</style>

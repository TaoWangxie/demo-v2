<template>
    <div
      class="pull-refresh-wrapper"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      ref="wrapper"
    >
      <div
        class="pull-refresh-indicator"
        v-if="isPulling || loading"
        :class="{ loading: loading }"
      >
        <div class="pull-text" v-if="isPulling">下拉刷新...</div>
        <div class="loading-text" v-if="loading">加载中...</div>
      </div>
      <div
        class="pull-refresh-content"
        :style="{ transform: `translate3d(0, ${pullDistance}px, 0)` }"
      >
        <slot></slot>
      </div>
    </div>
  </template>  
  <script>
  export default {
    name: "PullRefresh",
    data() {
      return {
        startY: 0,
        pullDistance: 0,
        isPulling: false,
        threshold: 100, // 触发刷新的阈值
      };
    },
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
    },
    watch: {
      loading: {
        deep: true,
        immediate: true,
        handler(val) {
          if (!val) {
            this.pullDistance = 0;
          }
        },
      },
    },
    methods: {
      touchStart(e) {
        this.startY = e.touches[0].pageY;
      },
      touchMove(e) {
        if (this.loading) return;
        const moveY = e.touches[0].pageY - this.startY;
        if (moveY > 0) {
          this.pullDistance = Math.min(moveY, this.threshold);
          this.isPulling = true;
        } else {
          this.pullDistance = 0;
          this.isPulling = false;
        }
      },
      touchEnd() {
        if (this.isPulling && this.pullDistance >= this.threshold) {
          this.isPulling = false;
          this.$emit("refresh"); // 触发刷新事件
        } else {
          this.isPulling = false;
          this.pullDistance = 0;
        }
      },
    },
  };
  </script>  
  <style lang="scss" scoped>
  $n: 1rem/32;
  .pull-refresh-wrapper {
    overflow: auto;
    position: relative;
    width: 100%;
    height: 100%;
  }
  .pull-refresh-content {
    transition: transform 0.3s ease;
    will-change: transform;
  }
  .pull-refresh-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .loading-text {
    display: none;
  }
  .loading .pull-text {
    display: none;
  }
  .loading .loading-text {
    display: block;
  }
  </style>
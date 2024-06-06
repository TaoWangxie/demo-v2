<template>
  <div class="goeays-video-player">
    <div class="video-snapshot" v-if="showSnapshot" @click="callFullScreen">
      <img :src="thumbnail.url" @load="onLoadEnd" />
      <div class="icon"></div>
    </div>
    <video
      ref="VideoPlayer"
      class="video-player"
      controls=""
      v-show="show"
      :src="video.url"
    ></video>
  </div>
</template>

<script>
export default {
  name: "VideoPlayer",
  props: {
    video: {
      type: Object,
    },
    showSnapshot: {
      type: Boolean,
      default: true,
    },
    thumbnail: {
      type: Object,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    callFullScreen() {
      this.show = true;
      let self = this,
        VideoPlayer = this.$refs.VideoPlayer,
        requestMethod =
          VideoPlayer.requestFullscreen ||
          VideoPlayer.webkitRequestFullScreen ||
          VideoPlayer.mozRequestFullScreen ||
          VideoPlayer.msRequestFullscreen;
      VideoPlayer.play();
      if (requestMethod) {
        requestMethod.call(VideoPlayer);
      }
      function pauseWhenQuitFullScreen() {
        if (VideoPlayer.played && !document.webkitIsFullScreen) {
          VideoPlayer.pause();
          self.show = false;
          VideoPlayer.removeEventListener(
            "fullscreenchange",
            pauseWhenQuitFullScreen
          );
        }
      }
      VideoPlayer.addEventListener("fullscreenchange", pauseWhenQuitFullScreen);
    },
    onLoadEnd() {
      this.$emit("onLoadEnd");
    },
  },
};
</script>

<style scoped>
.video-snapshot {
  position: relative;
  max-height: 1.5rem;
}
.video-snapshot img {
  height: 1.5rem;
}
.video-snapshot .icon {
  position: absolute;
  width: 0.3rem;
  height: 0.3rem;
  border-radius: 0.1rem;
  background: url("./images/play.png") no-repeat center;
  background-size: 100%;
  top: 50%;
  left: 50%;
  margin: -0.1rem;
}
.video-player {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
}
</style>

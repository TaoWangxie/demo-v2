<template>
  <div class="goeasy-audio-player" @click="playAudio">
    <div
      class="audio-facade"
      :style="{ width: Math.ceil(duration) * 7 + 80 + 'px' }"
    >
      <div class="audio-facade-bg" :class="{ 'play-icon': play }"></div>
      <div class="audio-facade-time">{{ Math.ceil(duration) || 0 }}"</div>
    </div>
    <audio ref="audioPlayer"></audio>
  </div>
</template>

<script>
export default {
  name: "AudioPlayer",
  props: ["src", "duration"],
  data() {
    return {
      play: false,
    };
  },
  methods: {
    playAudio() {
      if (this.play) {
        this.$refs.audioPlayer.pause();
        this.play = false;
        return;
      }
      this.play = true;
      this.$refs.audioPlayer.src = this.src;
      this.$refs.audioPlayer.load();
      this.$refs.audioPlayer.currentTime = 0;
      this.$refs.audioPlayer.play();
      setTimeout(() => {
        this.play = false;
      }, this.duration * 1000);
    },
  },
};
</script>

<style scoped>
.goeasy-audio-player {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.audio-facade {
  min-width: 18px; /* 0.15rem * 120px = 18px */
  padding: 3.6px 6px; /* 0.03rem * 120px = 3.6px, 0.05rem * 120px = 6px */
  height: 36px; /* 0.36rem * 120px = 36px */
  line-height: 30px; /* 0.3rem * 120px = 30px */
  background: #618dff;
  font-size: 12px; /* 0.12rem * 120px = 12px */
  border-radius: 8.4px; /* 0.07rem * 120px = 8.4px */
  color: #ffffff;
  display: flex;
}

.audio-facade-bg {
  background: url("./images/voice.png") no-repeat center;
  background-size: 18px; /* 0.15rem * 120px = 18px */
  width: 24px; /* 0.2rem * 120px = 24px */
}

.audio-facade-time {
  display: flex;
  align-items: center;
}

.audio-facade-bg.play-icon {
  background: url("./images/play.gif") no-repeat center;
  background-size: 18px; /* 0.15rem * 120px = 18px */
  -moz-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}
</style>

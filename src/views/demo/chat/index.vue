<template>
  <div class="chat">
    <div class="message-container">
      <div class="scroll-view" ref="scrollView">
        <div class="history-load-tip" @click="loadMoreHistoryMessage">
          {{ allHistoryLoaded ? "已经没有更多的历史消息" : "点击获取历史消息" }}
        </div>
        <div v-for="(message, index) in messages" :key="index">
          <div
            class="time-lag"
            v-if="
              index == 0 ||
              messages[index].timestamp - messages[index - 1].timestamp >
                5 * 60 * 1000
            "
          >
            {{ formatDate(message.timestamp) }}
          </div>
          <chat-message
            :message="message"
            :to="friend"
            :currentUser="currentUser"
            :type="type"
            @showImageFullScreen="showImageFullScreen"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChatMessage from "./ChatMessage";
export default {
  name: "ImPage",
  components: {
    ChatMessage,
  },
  data() {
    return {
      friend: {
        avatar: "https://element-plus.org/images/figure-1.png",
      },
      allHistoryLoaded: false,
      messages: [
        {
          senderId: "fdee46b0-4b01-4590-bdba-6586d7617f95",
          payload: {
            text: "33",
          },
          timestamp: 1717659570319,
          type: "text",
        },
        {
          senderId: "11",
          payload: {
            text: "2222333122[么么哒][便便]1232222333122222223331222222333122222233312222233312222223331223",
          },
          timestamp: "",
          type: "text",
        },
        {
          senderId: "fdee46b0-4b01-4590-bdba-6586d7617f95",
          payload: {
            url: "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
          },
          timestamp: "",
          type: "image",
        },
        {
          senderId: "11",
          payload: {
            contentType: "audio/mp3",
            name: "audio.mp3",
            size: 5976,
            url: "http://downsc.chinaz.net/files/download/sound1/201206/1638.mp3",
            duration: 2.988,
          },
          timestamp: "",
          type: "audio",
        },
        {
          senderId: "fdee46b0-4b01-4590-bdba-6586d7617f95",
          payload: {
            video: {
              name: "zz_zs.mp4",
              url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
              width: 500,
              height: 500,
              contentType: "video/mp4",
              size: 55041,
              duration: 2,
            },
            thumbnail: {
              name: "zz_zs.mp4",
              url: "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg",
              width: 500,
              height: 500,
              contentType: "image/jpg",
            },
          },
          timestamp: "",
          type: "video",
        },
        {
          senderId: "222",
          payload: {
            latitude: 40.7128,
            longitude: -74.006,
          },
          timestamp: 1717659570319,
          type: "map",
        },
      ],
      currentUser: {
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
        uuid: "fdee46b0-4b01-4590-bdba-6586d7617f95",
      },
      image: {
        show: false,
        url: "",
      },
      type: "",
    };
  },
  methods: {
    loadMoreHistoryMessage() {},
    showImageFullScreen(message) {
      this.image.url = message.payload.url;
      this.image.show = true;
    },
  },
};
</script>
<style scoped>
@import "./chat.css";
</style>

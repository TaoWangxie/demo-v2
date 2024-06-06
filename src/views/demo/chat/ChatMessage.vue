<template>
  <div
    class="message-item"
    :class="{ self: message.senderId == currentUser.uuid }"
  >
    <div>
      <div class="chat-avatar">
        <img
          v-if="message.senderId == currentUser.uuid"
          :src="currentUser.avatar"
        />
        <img v-else :src="to.avatar" />
      </div>
      <div class="chat-name">222</div>
    </div>
    <div class="chat-message">
      <div>
        <div
          v-if="message.type == 'text'"
          class="text-content"
          v-html="decoder.decode(message.payload.text)"
        ></div>
        <div v-if="message.type == 'image'" class="image-content">
          <img :src="message.payload.url" @click="showImageFullScreen" />
        </div>
        <div v-if="message.type == 'file'" class="file-content">
          <img src="/static/images/file-content.png" alt="" />
          <div class="description">
            <span class="title">{{ message.payload.name }}</span>
            <span class="size"
              >{{ (message.payload.size / 1024).toFixed(2) }} KB</span
            >
          </div>
        </div>
        <ImMap v-if="message.type == 'map'"></ImMap>
        <VideoPlayer
          v-if="message.type == 'video'"
          :video="message.payload.video"
          :thumbnail="message.payload.thumbnail"
        />
        <AudioPlayer
          v-if="message.type == 'audio'"
          :src="message.payload.url"
          :duration="message.payload.duration"
        />
        <div class="message_info">
          <span class="message_date">2024-05-01 10:11:30</span>
          <span>未读</span>
        </div>
        <div class="message_info">该消息已被系统屏蔽</div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import ImMap from "./ImMap";
import EmojiDecoder from "./EmojiDecoder";
export default {
  name: "chatMessage",
  props: ["message", "to", "currentUser", "type"],
  components: {
    AudioPlayer,
    VideoPlayer,
    ImMap,
  },
  data() {
    let emojiUrl = "https://imgcache.qq.com/open/qcloud/tim/assets/emoji/";
    let emojiMap = {
      "[么么哒]": "emoji_3@2x.png",
      "[乒乓]": "emoji_4@2x.png",
      "[便便]": "emoji_5@2x.png",
      "[信封]": "emoji_6@2x.png",
      "[偷笑]": "emoji_7@2x.png",
      "[傲慢]": "emoji_8@2x.png",
    };
    return {
      decoder: new EmojiDecoder(emojiUrl, emojiMap),
    };
  },
  methods: {
    showImageFullScreen() {
      this.$emit("showImageFullScreen", this.message);
    },
  },
};
</script>

<style scoped>
@import "./chatMessage.css";
</style>

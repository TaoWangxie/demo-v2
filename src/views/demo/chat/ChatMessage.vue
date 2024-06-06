<template>
  <div
    class="message-item"
    :class="{ self: message.senderId == currentUser.uuid }"
  >
    <img
      :src="currentUser.avatar"
      class="chat-avatar"
      v-if="message.senderId == currentUser.uuid"
    />
    <img :src="to.avatar" class="chat-avatar" v-else />
    <div class="chat-message">
      <div
        class="text-content"
        v-if="message.type == 'text'"
        v-html="decoder.decode(message.payload.text)"
      ></div>
      <div class="image-content" v-if="message.type == 'image'">
        <img :src="message.payload.url" @click="showImageFullScreen" />
      </div>
      <div class="file-content" v-if="message.type == 'file'">
        <img src="/static/images/file-content.png" alt="" />
        <div class="description">
          <span class="title">{{ message.payload.name }}</span>
          <span class="size"
            >{{ (message.payload.size / 1024).toFixed(2) }} KB</span
          >
        </div>
      </div>
      <GoEasyVideoPlayer
        v-if="message.type == 'video'"
        :video="message.payload.video"
        :thumbnail="message.payload.thumbnail"
      />
      <GoEasyAudioPlayer
        v-if="message.type == 'audio'"
        :src="message.payload.url"
        :duration="message.payload.duration"
      />
    </div>
  </div>
</template>

<script>
import GoEasyAudioPlayer from "./GoEasyAudioPlayer/GoEasyAudioPlayer";
import GoEasyVideoPlayer from "./GoEasyVideoPlayer/GoEasyVideoPlayer";
import EmojiDecoder from "./EmojiDecoder";
export default {
  name: "chatMessage",
  props: ["message", "to", "currentUser", "type"],
  components: {
    GoEasyAudioPlayer,
    GoEasyVideoPlayer,
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

<style>
@import "./chatMessage.css";
</style>

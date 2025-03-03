<template>
  <div class="right">
    <div class="right_action">
      <div class="action_btn" @click="deleteCurEl">删除</div>
    </div>
    <div class="right_content">
      <textarea
        type="text"
        v-if="currentEle"
        v-model="currentEle.text"
        @input="updateMiddleCanvas"
        placeholder="输入文本"
      ></textarea>
      <TableGrid></TableGrid>
    </div>
  </div>
</template>

<script>
import TableGrid from "@/views/h5Canvas/components/tableGrid/index.vue";
export default {
  name: "rightContainer",
  components: {
    TableGrid,
  },
  props: {
    currentEl: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    currentEl: {
      handler(n) {
        this.currentEle = n;
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      currentEle: null,
    };
  },
  methods: {
    deleteCurEl() {
      this.$emit("deleteCurEl");
    },
    updateMiddleCanvas() {
      this.$emit("updateMiddleCanvas");
    },
  },
};
</script>

<style scoped>
.right {
  width: 360px;
  border-left: 1px solid #e4e7ed;
  box-sizing: border-box;
  z-index: 1;
  background-color: #fff;
}
.right_action {
  display: flex;
  flex-wrap: wrap;
  padding: 8px 10px;
  border-bottom: 1px solid #e4e7ed;
}
.right_content {
  padding: 15px;
  box-sizing: border-box;
}
.action_btn {
  display: flex;
  font-size: 13px;
  padding: 5px 10px;
  align-items: center;
  justify-content: center;
  color: #f56c6c;
  background-color: #fff;
  border-radius: 4px;
  transition: all 0.3s;
  user-select: none;
}
.action_btn:hover {
  box-shadow: 0 0px 10px #ccc;
  cursor: pointer;
}
.action_btn:active {
  box-shadow: 0 0px 15px #909399;
  cursor: pointer;
}
textarea {
  width: 100%;
  height: 150px;
  min-height: 60px;
  max-height: 600px;
  padding: 12px;
  box-sizing: border-box;
  border: none;
  border-top: 4px solid #409eff;
  background-color: #f5f7fa;
  color: #333;
  font-size: 14px;
  resize: vertical;
  transition: border-bottom-color 0.3s ease;
}
textarea:focus {
  outline: none;
}
</style>

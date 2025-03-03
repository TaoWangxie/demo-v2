<template>
  <div class="right">
    <div class="right_action">
      <div
        :class="['action_btn', currentEle ? 'highlight' : 'disabled']"
        @click="deleteCurEl"
      >
        删除
      </div>
    </div>
    <div class="right_content">
      <textarea
        type="text"
        v-if="currentEle"
        v-model="currentEle.text"
        @input="updateRander"
        placeholder="输入文本"
      ></textarea>
      <TableGrid
        v-if="currentEle && currentEle.type == 'table'"
        :key="currentEle.key"
        :currentEl="currentEle"
        @updateElTableData="updateElTableData"
      ></TableGrid>
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
    updateRander() {
      this.$emit("updateRander");
    },
    updateElTableData(data) {
      this.$set(this.currentEl, "data", data);
      this.$emit("updateRander");
    },
  },
};
</script>

<style lang="scss" scoped>
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
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 4px;
  display: inline-block;
  background-color: #f2f6fc;
}
.highlight {
  background-color: #f2f6fc; /* 蓝色 */
  color: #f56c6c;
  cursor: pointer;
}
.disabled {
  background-color: #fafafa; /* 灰色 */
  cursor: not-allowed;
  color: #c0c4cc;
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

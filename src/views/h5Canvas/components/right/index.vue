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
    <div class="right_content" v-if="currentEle">
      <div v-if="currentEle.type == 'table'">
        <textarea
          type="text"
          v-model="currentEle.data[tdIndex].data"
          @input="updateRander"
          placeholder="输入文本"
        ></textarea>
        <TableGrid
          :key="currentEle.key"
          :currentEl="currentEle"
          @updateElTableData="(data) => updateElTableData(data, 'data')"
        ></TableGrid>
      </div>
      <template v-else>
        <div class="class_box">
          <div
            v-for="item in classList"
            :key="item.name"
            class="class_item"
            :class="{ active: currentEle.classList.includes(item.name) }"
            @click="toggleClass(item.name)"
          >
            <img :src="item.icon" alt="" />
          </div>
        </div>
        <textarea
          type="text"
          v-model="currentEle.data"
          @input="updateRander"
          placeholder="输入文本"
        ></textarea>
      </template>
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
    tdIndex: {
      type: [String, Number],
      default: -1,
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
      classList: [
        {
          name: "strong", //加粗
          icon: require("@/assets/strong.png"),
        },
        {
          name: "underline", //下划线
          icon: require("@/assets/underline.png"),
        },
        {
          name: "retract", //首行缩进
          icon: require("@/assets/retract.png"),
        },
      ],
    };
  },
  methods: {
    deleteCurEl() {
      this.$emit("deleteCurEl");
    },
    updateRander() {
      this.$emit("updateRander");
    },
    updateElTableData(data, property) {
      this.$set(this.currentEl, property, data);
      this.$emit("resetTd");
      this.updateRander();
    },
    // 切换样式
    toggleClass(type) {
      const index = this.currentEle.classList.indexOf(type);
      if (index === -1) {
        this.currentEle.classList.push(type);
      } else {
        this.currentEle.classList.splice(index, 1);
      }
      this.updateElTableData(this.currentEle.classList, "classList");
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
  padding: 10px;
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
  &:hover {
    background-color: #ebeef5;
  }
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
.class_box {
  display: flex;
  margin-bottom: 10px;
  .class_item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid #e4e7ed;
    border-right: none;
    cursor: pointer;
    &:last-child {
      border-right: 1px solid #e4e7ed;
    }
    img {
      display: inline-block;
      width: 50%;
      height: 50%;
    }
  }
  .active {
    background-color: #ffd700;
  }
}
</style>

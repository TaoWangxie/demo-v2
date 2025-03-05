<template>
  <div class="header">
    <div></div>
    <div>
      <div :class="['action_btn', 'highlight']" @click="importData">导入</div>
      <div
        :class="[
          'action_btn',
          middleElementsData.length ? 'highlight' : 'disabled',
        ]"
        @click="downloadPage"
      >
        导出
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderCom",
  components: {},
  props: {
    middleElementsData: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    downloadPage() {
      if (this.middleElementsData.length)
        this.download(this.middleElementsData);
    },
    importData() {},
    download(data) {
      // 将数据转换为 JavaScript 文件内容
      const fileContent = `export const page = ${JSON.stringify(
        data,
        null,
        2
      )};`;
      // 创建一个 Blob 对象
      const blob = new Blob([fileContent], { type: "application/javascript" });
      // 创建一个 URL 对象
      const url = URL.createObjectURL(blob);
      // 创建一个 <a> 元素
      const a = document.createElement("a");
      a.href = url;
      a.download = "page.js";
      // 模拟点击 <a> 元素来触发下载
      a.click();
      // 释放 URL 对象
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 头部样式 */
.header {
  height: 50px;
  border-bottom: 1px solid #e4e7ed;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px;
}
.action_btn {
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  border-radius: 4px;
  display: inline-block;
  margin-left: 10px;
}
.highlight {
  background-color: #f2f6fc; /* 蓝色 */
  color: #333;
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
</style>

<template>
  <div class="left">
    <div class="gridTag_box">
      <div
        class="gridTag_Item"
        v-for="(item, index) in list"
        :key="index"
        draggable="true"
        @dragstart="dragStart(item)"
        @dragend="dragEnd"
        @click="pushEl(item)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "gridTag",
  components: {},
  data() {
    return {
      list: [
        { type: "div", title: "标题", text: "标题", fontType: "B" },
        { type: "p", title: "正文", text: "正文" },
        {
          type: "table",
          title: "表格",
          text: "",
          data: [
            { row: 0, col: 0, text: "A1", key: "0-0" },
            { row: 0, col: 1, text: "B1", key: "0-1" },
            { row: 1, col: 0, text: "A2", key: "1-0" },
            { row: 1, col: 1, text: "B2", key: "1-1" },
            { row: 2, col: 0, text: "A3", key: "2-0" },
            { row: 2, col: 1, text: "B3", key: "2-1" },
          ],
        },
      ],
    };
  },
  methods: {
    dragStart(item) {
      this.$emit("dragStart", item);
    },
    dragEnd() {
      this.$emit("dragEnd");
      this.draggedEl = null;
    },
    pushEl(item) {
      this.$emit("pushEl", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.left {
  width: 240px;
  height: calc(100vh - 50px);
  border-right: 1px solid #e4e7ed;
  box-sizing: border-box;
  z-index: 1;
  background-color: #fff;
}
.gridTag_box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: auto;
  padding: 5%;
  background-color: #f2f6fc;
}
.gridTag_Item {
  flex: 0 0 45%;
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  -webkit-user-drag: element;
  user-select: none;
  background-color: #fff;
  border-radius: 4px;
  margin-right: calc(10%);
  margin-bottom: 15px;
  &:nth-child(2n) {
    margin-right: 0;
  }
  &:last-child {
    margin-right: auto;
  }
}
</style>

<template>
  <div class="container">
    <!-- 头部 -->
    <Header></Header>
    <!-- 内容区域 -->
    <div class="content">
      <!-- 左侧 -->
      <Left @dragStart="dragStart" @dragEnd="dragEnd" @pushEl="pushEl"></Left>
      <!-- 中间区域 -->
      <div id="main" class="main">
        <div class="page">
          <div
            id="middle"
            @dragover.prevent
            @dragleave.prevent="dragleave"
            @dragenter.prevent="dragenter"
            @drop="drop"
            @click.stop="selectMiddleItem"
          >
            <!-- 中间区域内容 -->
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <Right
        :currentEl="currentEl"
        @deleteCurEl="deleteCurEl"
        @updateMiddleCanvas="updateMiddleCanvas"
      ></Right>
    </div>
  </div>
</template>

<script>
import { monitorSelfClick } from "@/utils/index";
import Header from "@/views/h5Canvas/components/header/index.vue";
import Left from "@/views/h5Canvas/components/left/index.vue";
import Right from "@/views/h5Canvas/components/right/index.vue";
export default {
  name: "h5Canvas",
  components: {
    Header,
    Left,
    Right,
  },
  data() {
    return {
      middle: null, //画布
      middleElementsData: [], //画布数据
      currentEl: null, //当前元素
      currentIndex: -1, //当前元素下标
      dragIndex: 0,
      highlightedKey: null, //高亮key
      draggedEl: null, //拖拽元素
    };
  },
  mounted() {
    this.middle = document.getElementById("middle");
    monitorSelfClick("main", null, async () => {
      this.reset();
    });
  },
  methods: {
    dragStart(item) {
      this.draggedEl = item;
    },
    dragEnd() {
      this.draggedEl = null;
    },
    drop() {
      if (this.draggedEl) {
        let index =
          this.dragIndex < 0 ? this.middleElementsData.length : this.dragIndex;
        this.addEl(this.draggedEl, index);
      }
    },
    dragenter(e) {
      const children = Array.from(this.middle.children);
      const targetIndex = children.indexOf(e.target);
      this.dragIndex = targetIndex;
      if (children && children[targetIndex]) {
        children[targetIndex].style.borderTop =
          "20px solid rgb(247.5, 227.1, 196.5)";
      }
      if (children && children[children.length - 1] && targetIndex < 0) {
        children[children.length - 1].style.borderBottom =
          "20px solid rgb(247.5, 227.1, 196.5)";
      }
    },
    dragleave(e) {
      const children = Array.from(this.middle.children);
      const targetIndex = children.indexOf(e.target);
      if (children) {
        if (targetIndex < 0) {
          children[children.length - 1].style.borderBottom = "none";
        } else {
          children[targetIndex].style.borderTop = "none";
        }
      }
    },
    //
    rander() {
      while (this.middle.firstChild) {
        this.middle.removeChild(this.middle.firstChild);
      }
      const fragment = document.createDocumentFragment();
      this.middleElementsData.forEach((item) => {
        const element = this.createElement(item);
        if (item.key === this.highlightedKey) {
          element.classList.add("highlight");
        }
        fragment.appendChild(element);
      });
      this.middle.appendChild(fragment);
    },
    createElement(item) {
      const { type, text, fontType, key, data } = item;
      if (type == "table") {
        let element = this.createTableFromSelection(data, key);
        element.setAttribute("data-key", key);
        return element;
      } else {
        const element = document.createElement(type);
        if (fontType === "B") {
          element.style.fontWeight = "bold";
        }
        element.style.wordBreak = "break-all";
        element.textContent = text;
        // 可以将 key 作为自定义属性添加到元素上，方便后续操作
        element.setAttribute("data-key", key);
        return element;
      }
    },
    createTableFromSelection(selectedCells, parentKey) {
      // 创建单元格数据映射表
      const cellDataMap = {};
      selectedCells.forEach((cell) => {
        const mapKey = `${cell.row}_${cell.col}`;
        cellDataMap[mapKey] = {
          text: cell.text || "",
          dataKey: cell.key || "", // 新增data-key映射
        };
      });

      // 计算表格行列范围
      const rows = [...new Set(selectedCells.map((c) => c.row))];
      const cols = [...new Set(selectedCells.map((c) => c.col))];
      const minRow = Math.min(...rows);
      const maxRow = Math.max(...rows);
      const minCol = Math.min(...cols);
      const maxCol = Math.max(...cols);

      // 计算表格结构参数
      // const rowCount = maxRow - minRow + 1;
      const colCount = maxCol - minCol + 1;
      const colWidth = (100 / colCount).toFixed(2);

      // 创建表格元素
      const table = document.createElement("table");
      table.style.width = "100%";
      table.style.tableLayout = "fixed";
      table.setAttribute("border", "0");
      table.setAttribute("cellspacing", "0");
      table.setAttribute("cellpadding", "0");

      // 生成表格内容
      for (let r = minRow; r <= maxRow; r++) {
        const tr = document.createElement("tr");
        tr.style.height = "30px"; // 保持行高一致
        for (let c = minCol; c <= maxCol; c++) {
          const td = document.createElement("td");
          td.style.border = "1px solid #eee";
          td.style.textAlign = "center";
          td.style.verticalAlign = "middle";
          td.style.width = `${colWidth}%`; // 设置百分比宽度
          // 填充单元格内容
          const cellKey = `${r}_${c}`;
          if (cellDataMap[cellKey]) {
            td.setAttribute("data-key", parentKey);
            td.setAttribute("data-ckey", cellDataMap[cellKey].dataKey); // 设置data-key
            td.textContent = cellDataMap[cellKey].text;
          }
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }

      return table;
    },

    reset() {
      this.currentEl = null;
      this.currentIndex = -1;
      this.highlightedKey = null;
      this.rander();
    },
    pushEl(item) {
      if (item) {
        let index = this.middleElementsData.length;
        this.addEl(item, index);
      }
    },
    deleteCurEl() {
      if (this.currentIndex >= 0) {
        this.deleteEl(this.currentIndex);
      }
    },
    addEl(El, index) {
      // 生成唯一的 key
      const uniqueKey = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newItem = {
        key: uniqueKey,
        ...El,
      };
      this.middleElementsData.splice(index, 0, newItem);
      this.rander();
    },
    deleteEl(index) {
      this.middleElementsData.splice(index, 1);
      this.reset();
    },
    selectMiddleItem(event) {
      const target = event.target;
      const key = target.getAttribute("data-key");
      const ckey = target.getAttribute("data-ckey");
      console.log(key, ckey);
      if (key) {
        this.currentEl = this.middleElementsData.find(
          (item) => item.key === key
        );
        this.currentIndex = this.middleElementsData.findIndex(
          (item) => item.key === key
        );
        this.highlightedKey = key;
        console.log(this.middleElementsData);
        this.rander();
      }
    },
    handleInput() {
      if (this.currentEl && this.currentEl.text.length > 100) {
        this.currentEl.text = this.currentEl.text.slice(0, 100);
      }
    },
    updateMiddleCanvas() {
      this.rander();
    },
  },
};
</script>

<style lang="scss">
.conrainer {
  width: 100%;
  height: 100vh;
  display: flex;
}

/* 内容区域样式 */
.content {
  flex: 1;
  display: flex;
  height: calc(100vh - 50px);
  min-width: 1000px;
}

/* 中间区域样式 */
.main {
  flex: 1;
  background-color: #fafcff;
  position: relative;
}
.page {
  position: absolute;
  width: 350px;
  height: 780px;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  overflow: scroll;
  box-shadow: 0 0px 15px #ccc;
}
#middle {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 40px;
  overflow: scroll;
  box-sizing: border-box;
}
.highlight {
  background: rgb(235.9, 245.3, 255);
}
</style>

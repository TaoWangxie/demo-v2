<template>
  <div class="container">
    <!-- 头部 -->
    <Header :middleElementsData="middleElementsData"></Header>
    <!-- 内容区域 -->
    <div class="content">
      <!-- 左侧 -->
      <Left @dragStart="dragStart" @dragEnd="dragEnd" @pushEl="pushEl"></Left>
      <!-- 中间区域 -->
      <div id="main" class="main">
        <div class="page">
          <div
            id="middle"
            class="middle"
            @dragover.prevent
            @dragleave.prevent="dragleave"
            @dragenter.prevent="dragenter"
            @drop="drop"
            @click.stop="selectEl"
          >
            <!-- 中间区域内容 -->
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <Right
        :currentEl="currentEl"
        :tdIndex="tdIndex"
        @deleteCurEl="deleteCurEl"
        @updateRander="rander"
        @resetTd="resetTd"
      ></Right>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
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
      //上一个高亮的table
      highlightedTable: null,
      tdKey: null,
      tdIndex: -1,
    };
  },
  mounted() {
    this.middle = document.getElementById("middle");
    monitorSelfClick("main", null, async () => {
      this.reset();
    });
  },
  methods: {
    //===渲染方法===
    rander() {
      while (this.middle.firstChild) {
        this.middle.removeChild(this.middle.firstChild);
      }
      const fragment = document.createDocumentFragment();
      this.middleElementsData.forEach((item) => {
        const element = this.createElement(item);

        // 🟡 需要去掉 画布样式！！！
        if (item.key === this.highlightedKey) {
          element.classList.add("highlight");
        }
        fragment.appendChild(element);
      });
      this.middle.appendChild(fragment);
    },
    //创建元素
    createElement(item) {
      const { type, data, classList, key } = item;
      if (type == "table") {
        // 创建表格
        let element = this.createTableFromSelection(data, key);
        element.setAttribute("data-key", key);
        classList.forEach((item) => {
          element.classList.add(item);
        });
        return element;
      } else {
        // 根据type创建标签
        const element = document.createElement(type);
        classList.forEach((item) => {
          element.classList.add(item);
        });
        element.textContent = data;
        // 可以将 key 作为自定义属性添加到元素上，方便后续操作
        element.setAttribute("data-key", key);
        return element;
      }
    },
    //创建table
    createTableFromSelection(selectedCells, parentKey) {
      // 创建单元格数据映射表
      const cellDataMap = {};
      selectedCells.forEach((cell) => {
        const mapKey = `${cell.row}_${cell.col}`;
        cellDataMap[mapKey] = {
          data: cell.data || "",
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
      table.style.borderLeft = "1px solid #ccc";
      table.style.borderTop = "1px solid #ccc";
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
          td.style.borderRight = "1px solid #ccc";
          td.style.borderBottom = "1px solid #ccc";
          td.style.textAlign = "center";
          td.style.verticalAlign = "middle";
          td.style.width = `${colWidth}%`; // 设置百分比宽度
          // 填充单元格内容
          const cellKey = `${r}_${c}`;
          if (cellDataMap[cellKey]) {
            // 🟡 需要去掉 画布样式！！！
            if (this.tdKey && this.tdKey == cellDataMap[cellKey].dataKey) {
              td.style.background = "#fff";
            }
            td.setAttribute("data-key", parentKey);
            td.setAttribute("data-tdKey", cellDataMap[cellKey].dataKey); // 设置data-key
            td.textContent = cellDataMap[cellKey].data;
          }
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      return table;
    },

    //===拖拽===
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
      const table = e.target.closest("table");
      if (table) {
        //表格
        const targetIndex = children.indexOf(table);
        this.dragIndex = targetIndex;
        // 避免重复添加样式
        if (this.highlightedTable !== table) {
          // 移除之前表格的样式
          if (this.highlightedTable) {
            this.highlightedTable.style.borderTop = "none";
            this.highlightedTable.classList.remove("highlight-top");
          }
          // 添加新样式并更新引用
          table.classList.add("highlight-top");
          this.highlightedTable = table;
        }
      } else {
        const targetIndex = children.indexOf(e.target);
        this.dragIndex = targetIndex;
        if (children && children[targetIndex]) {
          children[targetIndex].classList.add("highlight-top");
        }
        if (children && children[children.length - 1] && targetIndex < 0) {
          children[children.length - 1].classList.add("highlight-bottom");
        }
      }
    },
    dragleave(e) {
      const children = Array.from(this.middle.children);
      const table = e.target.closest("table");
      if (table) {
        //表格
        const targetIndex = children.indexOf(table);
        // 获取离开时关联的元素
        const relatedTarget = e.relatedTarget;
        // 检查离开目标是否仍在表格内部
        if (
          this.highlightedTable &&
          (!relatedTarget || !this.highlightedTable?.contains(relatedTarget))
        ) {
          if (targetIndex < 0) {
            children[children.length - 1].classList.remove("highlight-bottom");
          } else {
            this.highlightedTable.classList.remove("highlight-top");
            this.highlightedTable = null;
          }
        }
      } else {
        const children = Array.from(this.middle.children);
        const targetIndex = children.indexOf(e.target);
        if (children) {
          if (targetIndex < 0) {
            children[children.length - 1].classList.remove("highlight-bottom");
          } else {
            children[targetIndex].classList.remove("highlight-top");
          }
        }
      }
    },

    //===操作===
    //点击添加
    pushEl(item) {
      if (item) {
        let index = this.middleElementsData.length;
        this.addEl(item, index);
      }
    },
    //点击删除
    deleteCurEl() {
      if (this.currentIndex >= 0) {
        this.deleteEl(this.currentIndex);
      }
    },
    //添加标签
    addEl(El, index) {
      // 生成唯一的 key
      const uniqueKey = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const newItem = {
        key: uniqueKey,
        ...El,
      };
      this.middleElementsData.splice(index, 0, _.cloneDeep(newItem));
      this.rander();
    },
    //删除标签
    deleteEl(index) {
      this.middleElementsData.splice(index, 1);
      this.reset();
    },
    //选中标签
    selectEl(event) {
      const target = event.target;
      const key = target.getAttribute("data-key");
      const tdKey = target.getAttribute("data-tdKey");
      this.tdKey = tdKey;
      if (key) {
        this.currentEl = this.middleElementsData.find(
          (item) => item.key === key
        );
        this.currentIndex = this.middleElementsData.findIndex(
          (item) => item.key === key
        );
        this.highlightedKey = key;
        this.rander();
      }
      if (tdKey) {
        this.tdIndex = this.currentEl.data.findIndex(
          (item) => item.key === tdKey
        );
      }
      console.log(this.middleElementsData);
    },
    resetTd() {
      this.tdIndex = 0;
      this.tdKey = this.currentEl.data[0].key;
    },
    //取消选中标签
    reset() {
      this.currentEl = null;
      this.currentIndex = -1;
      this.highlightedKey = null;
      this.tdKey = null;
      this.tdIndex = -1;
      this.rander();
    },
  },
};
</script>

<style lang="scss">
.highlight-top {
  border-top: 20px solid rgb(247.5, 227.1, 196.5) !important;
}
.highlight-bottom {
  border-bottom: 20px solid rgb(247.5, 227.1, 196.5) !important;
}

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
  min-width: 900px;
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
.highlight {
  background: rgb(235.9, 245.3, 255);
}
</style>
<style>
.middle {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 40px;
  overflow: scroll;
  box-sizing: border-box;
  line-height: 22px;
  font-size: 14px;
}
.middle p {
  word-break: break-all;
  list-style: none;
  color: #333;
  width: 100%;
  height: auto;
  overflow: hidden;
  text-align: left;
  padding-bottom: 10px;
}
.middle td {
  word-break: break-all;
  padding: 4px;
}
.table-box {
  width: 100%;
  height: auto;
  overflow: hidden;
  margin-bottom: 10px;
}
/* ==== */
.strong {
  font-weight: bold;
}
.underline {
  text-decoration: underline;
}
.retract {
  text-indent: 20px;
}
</style>
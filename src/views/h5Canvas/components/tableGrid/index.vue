<template>
  <div class="grid_box">
    <div class="grid_action">
      <p>从第一个格子开始绘制</p>
      <div>
        <span @click="reset" :class="[isConfirm ? '' : 'disabled']">重制</span>
        <span
          :class="['grid_confirm', isConfirm ? 'highlight' : 'disabled']"
          @click="confirm"
          >应用</span
        >
      </div>
    </div>
    <div
      class="grid"
      @mousedown="startSelection"
      @mousemove="updateSelection"
      @mouseup="endSelection"
      @mouseleave="endSelection"
    >
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          :class="{ selected: cell.isSelected }"
          :data-row="rowIndex"
          :data-col="colIndex"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tableGrid",
  components: {},
  props: {
    currentEl: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      grid: Array(10)
        .fill()
        .map(() =>
          Array(10)
            .fill()
            .map(() => ({ isSelected: false }))
        ),
      isSelecting: false,
      startCell: null,
      hasMoved: false, // 新增移动状态标记
      selectedCells: [],
      isConfirm: false,
    };
  },
  watch: {
    currentEl: {
      handler(n) {
        let cells = n.data || [];
        this.init(cells);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    init(cells) {
      this.clearSelection();
      this.selectedCells = cells;
      cells.forEach((item) => {
        let { row, col } = item;
        this.grid[row][col].isSelected = true;
      });
    },
    startSelection(event) {
      this.isSelecting = true;
      this.hasMoved = false; // 初始化移动状态
      const cell = this.getCellFromEvent(event);
      if (cell) {
        if (cell.row != 0 || cell.col != 0) return;
        this.startCell = cell;
        this.clearSelection();
      }
    },
    updateSelection(event) {
      if (!this.isSelecting) return;

      this.hasMoved = true; // 标记为已移动
      const endCell = this.getCellFromEvent(event);
      if (!endCell || !this.startCell) return;

      // 矩形选择逻辑保持不变
      const minRow = Math.min(this.startCell.row, endCell.row);
      const maxRow = Math.max(this.startCell.row, endCell.row);
      const minCol = Math.min(this.startCell.col, endCell.col);
      const maxCol = Math.max(this.startCell.col, endCell.col);

      this.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          cell.isSelected =
            rowIndex >= minRow &&
            rowIndex <= maxRow &&
            colIndex >= minCol &&
            colIndex <= maxCol;
        });
      });
    },
    endSelection() {
      if (this.isSelecting && !this.hasMoved && this.startCell) {
        this.grid[this.startCell.row][this.startCell.col].isSelected = true;
      }
      if (this.isSelecting && this.startCell) {
        this.isConfirm = true;
      }
      this.isSelecting = false;
      this.startCell = null;
      this.hasMoved = false;
      this.selectedCells = this.getSelectedCells();
    },
    // 其他方法保持不变
    getCellFromEvent(event) {
      const cell = event.target.closest(".cell");
      if (!cell) return null;
      return {
        row: parseInt(cell.dataset.row),
        col: parseInt(cell.dataset.col),
      };
    },
    clearSelection() {
      this.grid.forEach((row) => {
        row.forEach((cell) => {
          cell.isSelected = false;
        });
      });
    },
    getSelectedCells() {
      const result = [];
      this.grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell.isSelected) {
            // 注意这里的索引从1开始（符合日常计数习惯）
            result.push({
              row: rowIndex,
              col: colIndex,
              key: `${rowIndex}-${colIndex}`,
              text: "",
            });
          }
        });
      });
      return result;
    },
    reset() {
      if (this.isConfirm) {
        console.log("reset");
        this.isConfirm = false;
        this.init(this.currentEl.data);
      }
    },
    confirm() {
      if (this.isConfirm) {
        console.log("confirm", this.selectedCells);
        this.$emit("updateElTableData", this.selectedCells);
        this.isConfirm = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.grid_box {
  width: 100%;
  text-align: center;
}
.grid {
  display: inline-block;
  border-top: 1px solid #e4e7ed;
  border-left: 1px solid #e4e7ed;
  user-select: none;
  margin: 0 auto;
}
.row {
  display: flex;
}
.cell {
  width: 30px;
  height: 30px;
  border-right: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  background-color: white;
  transition: background-color 0.2s;
}
.cell.selected {
  background-color: #626aef;
  /* ff44aa */
}
.cell:hover {
  background-color: rgb(197.7, 225.9, 255);
}
.grid_action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin: 8px 9px;
  p {
    color: #909399;
  }
  span {
    margin-left: 8px;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    display: inline-block;
    background-color: #f2f6fc;
  }
  .grid_confirm {
    transition: background-color 0.8s; /* 过渡动画 */
  }
  .highlight {
    background-color: #2196f3; /* 蓝色 */
    color: #fff;
    cursor: pointer;
  }
  .disabled {
    background-color: #fafafa; /* 灰色 */
    cursor: not-allowed;
    color: #c0c4cc;
  }
}
</style>

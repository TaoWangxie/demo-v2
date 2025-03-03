<template>
  <div class="grid_box">
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
      selectedCells: [
        { row: 0, col: 0, text: "A1", key: "0-0" },
        { row: 0, col: 1, text: "B1", key: "0-1" },
        { row: 1, col: 0, text: "A2", key: "1-0" },
        { row: 1, col: 1, text: "B2", key: "1-1" },
      ],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.selectedCells.forEach((item) => {
        let { row, col } = item;
        this.grid[row][col].isSelected = true;
      });
    },
    startSelection(event) {
      this.isSelecting = true;
      this.hasMoved = false; // 初始化移动状态
      const cell = this.getCellFromEvent(event);
      if (cell.row != 0 || cell.col != 0) return;
      if (cell) {
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
      // 处理单击选择
      if (this.isSelecting && !this.hasMoved && this.startCell) {
        this.grid[this.startCell.row][this.startCell.col].isSelected = true;
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
  },
};
</script>

<style scoped>
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
}
</style>

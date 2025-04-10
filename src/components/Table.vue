<template>
  <div class="calendarTable">
    <el-table
      v-bind="bindTable"
      :data="tableData"
      :span-method="arraySpanMethod"
    >
      <!-- 多选 -->
      <template v-if="!hideConfig.includes('checkbox')">
        <el-table-column
          :type="isType"
          width="55"
          fixed="left"
          :align="'center'"
        />
      </template>
      <!-- 序号 -->
      <template v-if="!hideConfig.includes('serial')">
        <el-table-column
          type="index"
          :align="'center'"
          width="55"
          fixed="left"
          label="序号"
        />
      </template>
      <template v-for="(colItem, index) in columns">
        <el-table-column
          :key="index"
          :prop="colItem.prop"
          v-bind="colItem.attr"
          show-overflow-tooltip
        >
          <!-- 头部插槽 -->
          <template slot="header" slot-scope="scope">
            <slot
              v-if="colItem.headerSlot || allHeaderSlot"
              name="header"
              :scope="{ $data: scope, $column: colItem, $columnIndex: index }"
            />
            <template v-else>
              {{ colItem.label }}
            </template>
          </template>
          <!-- 插槽 -->
          <template slot-scope="scope">
            <template v-if="allSlot">
              <template v-if="!allSlotExceptColumnIndexs.includes(index)">
                <slot
                  name="default"
                  :scope="{ $data: scope, $columnIndex: index }"
                />
              </template>
              <template v-else>{{ scope.row[colItem.prop] }}</template>
            </template>
            <template v-else-if="colItem.colType === 'slot'">
              <slot :name="colItem.prop" :scope="scope" />
            </template>
            <!-- 普通列 -->
            <template v-else>
              {{ scope.row[colItem.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div ref="paginationBox" :class="['pagination-style']">
      <!-- 分页 -->
      <el-pagination
        v-if="!hideConfig.includes('pagination') && pagination.total"
        v-bind="setPaginationAttr()"
        @size-change="pageChange($event, 'pageSize')"
        @current-change="pageChange($event, 'pageNum')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "calendarTable",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: () => {},
    },
    isType: {
      type: String,
      default: "selection",
    },
    hideConfig: {
      type: Array,
      default: () => [],
    },
    allSlot: {
      //全部插槽
      type: Boolean,
      default: false,
    },
    allSlotExceptColumnIndexs: {
      //全部插槽除外的列下标
      type: Array,
      default: () => [],
    },
    allHeaderSlot: {
      //全部头部插槽
      type: Boolean,
      default: false,
    },
    COLUMN_OFFSET: {
      //全部插槽
      type: Number,
      default: 0,
    },
  },
  mounted() {},
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        this.tableData = val;
      },
    },
  },
  computed: {
    bindTable() {
      return {
        stripe: false,
        loading: this.loading || false,
        ...this.$attrs,
      };
    },
  },
  data() {
    return {
      tableData: [],
      selectList: [],
    };
  },
  methods: {
    //分页点击
    pageChange(val, type) {
      this.selectList = [];
      this.pagination[type] = val;
      this.$emit("update:pagination", this.pagination);
      this.$emit("handlePageChange", val);
    },
    setPaginationAttr() {
      let defaultAttr = {
        background: true,
        "page-sizes": [10, 50, 100, 200, 500],
        layout: "total, sizes, prev, pager, next",
        "current-page": 1,
        "page-size": 0,
        total: 0,
      };
      let attr = Object.assign(defaultAttr, this.pagination);
      return attr;
    },
    //合并行单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      const COLUMN_OFFSET = this.COLUMN_OFFSET; // 固定列数量（如序号列+车辆列）
      const DATA_START = 1; // 数据列起始编号
      let mergedRanges = this.getMergedRanges(
        row.tasks,
        DATA_START,
        COLUMN_OFFSET
      );
      // 3. 合并逻辑判断
      for (const range of mergedRanges) {
        if (columnIndex === range.start) {
          return [1, range.end - range.start + 1];
        } else if (columnIndex > range.start && columnIndex <= range.end) {
          return [0, 0];
        }
      }
      return [1, 1];
    },
    getMergedRanges(tasks, DATA_START, COLUMN_OFFSET) {
      if (!tasks || !Array.isArray(tasks)) {
        return [1, 1];
      }
      // 1. 生成原始区间并排序
      const rawRanges = tasks
        .map((item) => {
          const date = item?.date;
          if (!Array.isArray(date) || date.length < 2) return null;
          const start = date[0] - DATA_START + COLUMN_OFFSET;
          const end = date[1] - DATA_START + COLUMN_OFFSET;
          return start <= end && start >= COLUMN_OFFSET ? { start, end } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.start - b.start);

      // 2. 合并连续区间
      const mergedRanges = [];
      for (const range of rawRanges) {
        const last = mergedRanges[mergedRanges.length - 1];
        if (last && range.start <= last.end) {
          //last.end + 1
          // 合并重叠或连续的区间
          last.end = Math.max(last.end, range.end);
        } else {
          mergedRanges.push({ ...range });
        }
      }
      return mergedRanges;
    },
  },
};
</script>

<style lang="scss" scoped>
.calendarTable {
  flex: 1;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  padding: 0;

  .pagination-style {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 0;
    padding-left: 14px;
    height: 36px;
    .reverse-left {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}

.calendarTable ::v-deep .el-table .cell {
  padding: 0;
  width: 100%;
  height: 100%;
  line-height: 50px;
  text-align: center;
}
.calendarTable ::v-deep .el-table .el-table__cell {
  padding: 0;
  height: 50px;
}
.calendarTable ::v-deep .el-table th.el-table__cell {
  background: #f8f8f9;
}
</style>
  
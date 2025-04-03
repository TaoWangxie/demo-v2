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
    // arraySpanMethod({ row, column, rowIndex, columnIndex }) {
    //   let offset = 1; //默认起始列
    //   // 检查是否存在有效的日期范围
    //   if (!row.date || row.date.length < 2) {
    //     return [1, 1];
    //   }
    //   // 将1转换为0索引
    //   const start = row.date[0] - 1 + offset;
    //   const end = row.date[1] - 1 + offset;
    //   // 校验索引有效性
    //   if (start < 0 || end < 0 || start > end) {
    //     return [1, 1];
    //   }
    //   // 处理需要合并的列
    //   if (columnIndex === start) {
    //     // 计算合并列数
    //     return [1, end - start + 1];
    //   } else if (columnIndex > start && columnIndex <= end) {
    //     // 隐藏合并区间内的列
    //     return [0, 0];
    //   }
    //   // 默认不合并
    //   return [1, 1];
    // },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      // 参数说明（根据你的列结构调整 offset）
      const COLUMN_OFFSET = 2; // 固定列数量（如序号列+车辆列）
      const DATA_START = 1; // 数据列起始编号（用户输入的 task 值从1开始）

      // 1. 空值检查
      if (!row.task || !Array.isArray(row.task)) {
        return [1, 1];
      }

      // 2. 遍历所有合并区间
      const mergeRanges = [];
      for (const item of row.task) {
        // 2.1 提取有效 task
        const task = item?.date;
        if (!Array.isArray(task) || task.length < 2) continue;

        // 2.2 计算实际列索引
        const start = task[0] - DATA_START + COLUMN_OFFSET;
        const end = task[1] - DATA_START + COLUMN_OFFSET;

        // 2.3 过滤无效区间
        if (start > end || start < COLUMN_OFFSET) continue;
        mergeRanges.push({ start, end });
      }

      // 3. 合并逻辑判断
      for (const range of mergeRanges) {
        // 3.1 处理起始列
        if (columnIndex === range.start) {
          return [1, range.end - range.start + 1];
        }
        // 3.2 隐藏区间内的其他列
        else if (columnIndex > range.start && columnIndex <= range.end) {
          return [0, 0];
        }
      }

      // 4. 默认不合并
      return [1, 1];
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
  line-height: 46px;
  text-align: center;
}
.calendarTable ::v-deep .el-table .el-table__cell {
  padding: 0;
  height: 46px;
}
.calendarTable ::v-deep .el-table th.el-table__cell {
  background: #f8f8f9;
}
</style>
  
<template>
  <div class="Etable">
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
          <template slot="header" slot-scope="scope">
            <slot
              v-if="colItem.headerSlot || allHeaderSlot"
              name="header"
              :scope="{ scope, column: colItem, columnIndex: index }"
            />
            <template v-else>
              {{ colItem.label }}
            </template>
          </template>
          <template slot-scope="scope">
            <template v-if="allSlot">
              <slot name="default" :scope="{ scope, columnIndex: index }" />
            </template>
            <template v-if="colItem.colType === 'slot'">
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
  </div>
</template>

<script>
export default {
  name: "EditTable",
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
    isType: {
      type: String,
      default: "selection",
    },
    hideConfig: {
      type: Array,
      default: () => [],
    },
    allSlot: {
      type: Boolean,
      default: false,
    },
    allHeaderSlot: {
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
  data() {
    return {
      tableData: [],
    };
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
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex);
      let offset = 1; //默认起始列
      // 1. 检查是否存在有效的日期范围
      if (!row.date || row.date.length < 2) {
        return [1, 1];
      }
      // 2. 将1转换为0索引
      const start = row.date[0] - 1 + offset;
      const end = row.date[1] - 1 + offset;
      // 3. 校验索引有效性
      if (start < 0 || end < 0 || start > end) {
        return [1, 1];
      }
      // 4. 处理需要合并的列
      if (columnIndex === start) {
        // 计算合并列数
        return [1, end - start + 1];
      } else if (columnIndex > start && columnIndex <= end) {
        // 隐藏合并区间内的列
        return [0, 0];
      }
      // 5. 默认不合并
      return [1, 1];
    },
  },
};
</script>

<style scoped>
.Etable {
  flex: 1;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
  padding: 0;
}

.Etable ::v-deep .el-table .cell {
  padding: 0;
  height: 100%;
  line-height: 46px;
  text-align: center;
}
.Etable ::v-deep .el-table .el-table__cell {
  padding: 0;
  height: 46px;
}
</style>
  
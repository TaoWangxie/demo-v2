<template>
    <el-table-column
      v-if="column.children"
      min-width="120px"
      show-overflow-tooltip
      v-bind="column"
    >
      <template v-for="(colItem, index) in column.children">
        <ETableColumn
        :column="colItem"
        :tableFrom="tableFrom" 
        :key="colItem.label + index"
        @dataChange="dataChange"
        >
          <template v-for="(slotname) in colItem.slotname" v-slot:[slotname]="{ scope }">
            <slot :name="slotname" :scope="scope"></slot> 
          </template>
        </ETableColumn>
      </template>
  </el-table-column>
  <el-table-column
    v-else
    min-width="120px"
    :prop="column.prop"
    show-overflow-tooltip
    v-bind="column"
  >
    <template #default="scope">
        <template v-if="column.colType === 'slot'">
            <el-form-item
            :prop="'data.' + scope.$index + `.${column.prop}`"
            :rules="tableFrom.rules ? tableFrom.rules[column.prop] : []"
            :data-prop="column.prop"
            >
              <slot :name="column.prop" :scope="scope" />
            </el-form-item>
        </template>
        <template v-else-if="column.colType === 'input'">
          <el-form-item
              :prop="'data.' + scope.$index + `.${column.prop}`"
              :rules="tableFrom.rules ? tableFrom.rules[column.prop] : []"
              :data-prop="column.prop"
          >
              <el-input
              v-model="scope.row[column.prop]"
              placeholder="请输入"
              v-bind="column.col"
              size="small"
              @input="dataChange($event, column, scope.$index)"
              />
          </el-form-item>
        </template>
        <template v-else>
            {{ scope.row[column.prop] ? scope.row[column.prop] : "-" }}
        </template>
    </template>
  </el-table-column>
</template>
<script>
export default {
  name: "ETableColumn",
  components: {
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    tableFrom: {
      type: Object,
      default: () => {},
    },
    column: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
  },
  data() {
    return {
      tableData: [],
    };
  },

  methods: {
    dataChange(val, columns, index) {
        this.$emit("dataChange", val, columns, index);
    },
  }
}


</script>
<style scoped>
</style>
  
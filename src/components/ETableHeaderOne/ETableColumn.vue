<template>
  <el-table-column
    min-width="120px"
    show-overflow-tooltip
    v-bind="column"
  >
    <template v-for="(colItem, index) in column.children">
      <ETableColumn 
      v-if="colItem.children" 
      :column="colItem" 
      :columns="colItem.children" 
      :tableFrom="tableFrom" 
      :key="colItem.label + index"
      @dataChange="dataChange"
      ></ETableColumn>
      <template v-else>
        <el-table-column
            :key="colItem.label + index"
            :prop="colItem.prop"
            v-bind="colItem"
            min-width="120px"
            show-overflow-tooltip
        >
            <template #default="scope">
                <template v-if="colItem.colType === 'slot'">
                    <el-form-item
                    :prop="'data.' + scope.$index + `.${colItem.prop}`"
                    :rules="tableFrom.rules ? tableFrom.rules[colItem.prop] : []"
                    >
                    <slot :name="colItem.prop" :scope="scope" />
                    </el-form-item>
                </template>
                <template v-else-if="colItem.colType === 'input'">
                <el-form-item
                    :prop="'data.' + scope.$index + `.${colItem.prop}`"
                    :rules="tableFrom.rules ? tableFrom.rules[colItem.prop] : []"
                >
                    <el-input
                    v-model="scope.row[colItem.prop]"
                    placeholder="请输入"
                    v-bind="colItem.col"
                    size="small"
                    @input="dataChange($event, colItem, scope.$index)"
                    />
                </el-form-item>
                </template>
                <template v-else>
                    {{ scope.row[colItem.prop] ? scope.row[colItem.prop] : "-" }}
                </template>
            </template>
        </el-table-column>
      </template>
    </template>
  </el-table-column>
</template>
<script>
export default {
  name: "ETableColumn",
  components: {},
  props: {
    tableFrom: {
      type: Object,
      default: () => {},
    },
    column: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
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
  
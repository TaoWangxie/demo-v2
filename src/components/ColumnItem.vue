<template>
    <div class="column">
      <div v-for="(colItem, index) in columns" :key="index">
        <div v-if="colItem.children">
          <el-table-column :prop="colItem.prop" v-bind="colItem">
            <ColumnItem :columns="colItem.children" :tableFrom="tableFrom"></ColumnItem>
          </el-table-column>
        </div>
        <el-table-column
          v-else
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
                <!-- 普通列 -->
                <template v-else>
                    {{ scope.row[colItem.prop] ? scope.row[colItem.prop] : "-" }}
                </template>
            </template>
        </el-table-column>
      </div>
    </div>
</template>
<script>
export default {
  name: "ColumnItem",
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
  },
  mounted() {
  },

  data() {
    return {
      tableData: [],
    };
  },

  methods: {
    dataChange(val, columns, scope) {
        console.log(val)
        this.$emit("dataChange", columns, val, scope.$index);
    },
  }
}


</script>
<style scoped>
</style>
  
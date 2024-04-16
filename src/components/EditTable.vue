<template>
    <div class="Etable">
      <el-form
        ref="formTable"
        style="width: 100%; margin: 0 !important"
        :model="tableFrom"
        :rules="tableFrom.rules"
      >
        <el-table v-bind="bindTable" :data="tableFrom.data">
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
          <el-table-column
            v-for="(colItem, index) in columns"
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
              <template v-else-if="colItem.colType === 'inputNumber'">
                <el-form-item
                  :prop="'data.' + scope.$index + `.${colItem.prop}`"
                  :rules="tableFrom.rules ? tableFrom.rules[colItem.prop] : []"
                >
                  <el-input-number
                    v-model="scope.row[colItem.prop]"
                    style="width: 100%"
                    v-bind="colItem.col"
                    size="small"
                    @change="dataChange($event, colItem, scope.$index)"
                  />
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
        </el-table>
      </el-form>
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
    rules: {
      type: Object,
      default: () => ({}),
    },
    hideConfig: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
  },
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
    tableFrom() {
      return {
        data: this.tableData,
        rules: this.rules,
      };
    },
  },
  methods: {
    async confirmRule(params = { mustData: false, noValid: false }){
      let { mustData, noValid } = params;
      if (mustData && !this.tableData.length) return false;
      if ((!mustData && !this.tableData.length) || noValid)
        return Promise.resolve(this.tableData);
      const { valid, fields } = await new Promise((resolve) => {
        this.$refs.formTable.validate((valid, fields) => {
          resolve({
            valid: valid,
            fields: fields,
          });
        });
      });
      if (!valid) {
        let errorInfos = [];
        Object.values(fields).map((item) => {
          errorInfos.push({
            rowIndex: Number(item[0].field.split(".")[1]),
            prop: item[0].field.split(".")[2],
            message: item[0].message,
          });
        });
        return {
          valid: false,
          fields: errorInfos,
        };
      } else {
        return Promise.resolve(this.tableData.value);
      }
    },
    dataChange(val, columns, scope) {
        this.$emit("dataChange", columns, val, scope.$index);
    },
  }
}


</script>
<style scoped>
.Etable ::v-deep .el-form .el-form-item {
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
}
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
</style>
  
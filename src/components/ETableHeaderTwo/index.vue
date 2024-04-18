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
            <template v-for="(colItem, index) in columns">
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
        </el-table>
        
      </el-form>
    </div>
</template>

<script>
import ETableColumn from "./ETableColumn";
export default {
  name: "EditTable",
  components: {
    ETableColumn
  },
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
    dataChange(val, columns, index) {
        this.$emit("dataChange", val, columns, index);
    },
  }
}
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
.Etable ::v-deep .el-form .el-form-item {
  padding: 0 !important;
  margin: 0 !important;
  width: 100%;
}
.ETable ::v-deep .el-table tbody tr:last-child > td{
  border-bottom: none !important;
}
</style>
  
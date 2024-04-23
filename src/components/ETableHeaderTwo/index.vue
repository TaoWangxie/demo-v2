<template>
    <div class="Etable">
      <el-form
        ref="formTable"
        style="width: 100%; margin: 0 !important"
        :model="tableFrom"
        :rules="tableFrom.rules"
      >
        <el-table v-drag-select2="callBack" v-bind="bindTable" :data="tableFrom.data">
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
            <template v-for="(colItem, index) in slotColumns">
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
    slotColumns() {
      return this.convertColumns(this.columns)
    }
  },
  methods: {
    callBack(selectedData,startCellPos){
      let startCellProp = this.columns[startCellPos[1]].prop
      let startCellVal = this.tableData[startCellPos[0]][startCellProp]
      let rows = selectedData.map((item)=>item.row)
      console.log(startCellVal,startCellPos,selectedData)
      this.tableData.forEach((item,index)=>{
        if(rows.includes(index)){
          item[startCellProp] = startCellVal
        }
      })
      this.$emit('update:data', this.tableData);
    },
    convertColumns(columns) {  
      return columns.map(column => {  
        const newColumn = { ...column };  
        // 初始化 slotname 数组  
        newColumn.slotname = [];  
        // 如果当前对象有 children，则遍历它们  
        if (newColumn.children) {  
          newColumn.children = newColumn.children.map(child => {  
            const newChild = { ...child };  
            // 如果 child 的 colType 是 'slot'，则添加其 prop 到 slotname  
            if (child.colType === 'slot') {  
              newChild.slotname = [child.prop];  
              newColumn.slotname.push(child.prop); // 同时添加到父级的 slotname  
            }  
            return newChild;  
          });  
        }  
        // 如果当前对象的 colType 是 'slot'，则添加其 prop 到 slotname  
        if (newColumn.colType === 'slot') {  
          newColumn.slotname = [newColumn.prop];  
          // 如果父对象也有 slotname，合并它们  
          if (newColumn.slotname.length && newColumn.slotname.indexOf(newColumn.prop) === -1) {  
            newColumn.slotname = [...new Set([...newColumn.slotname, ...newColumn.children.reduce((acc, child) => acc.concat(child.slotname), newColumn.prop)])]
          }
        }
        return newColumn;
      });  
    },
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
  
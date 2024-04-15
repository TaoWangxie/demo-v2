<template>
  <div class="hello" >
    <el-button type="primary" @click="transport">手动埋点</el-button>
    <div class="table_box">
      <el-table
        ref="myTable"
        :data="tableData"
        v-drag-select
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="province"
          label="省份"
          >
        </el-table-column>
        <el-table-column
          prop="city"
          label="市区">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="邮编">
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普',
        zip: 200333
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普',
        zip: 200333
      }],
    }
  },
  mounted() {
    console.log(window.WTJS)
  },
  methods: {
    transport(){
      window.WTJS.transport.send({
        type: "event_click_nav",
        fromId: "dvergfcedfv",
        isTrack: true,
      })
    }
  },
};
</script>
<style scoped>
.table_box{
  width: 700px;
  -webkit-user-select: none; /* Chrome, Safari, Android */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* 标准语法 */
}
</style>

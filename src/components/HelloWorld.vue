<template>
  <div class="hello" >
    <!-- <el-button type="primary" @click="transport">手动埋点</el-button>
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
    </div> -->
    <!-- <ETableHeaderTwo
      ref="ETableHeaderTwo"
      :data="tableInfo.data" 
      :columns="tableInfo.columns"
      :rules="tableInfo.rules"
      :hideConfig="tableInfo.hideConfig"
      @dataChange="dataChange"
      >
      <template #userCode="{ scope }">
        <div>{{ scope.row.userCode }}</div>
      </template>
      <template #userName="{ scope }">
        <div>{{ scope.row.userName }}</div>
      </template>
      <template #userName2="{ scope }">
        <div>{{ scope.row.userName2 }}</div>
      </template>
    </ETableHeaderTwo> -->
    <div class="table_box">
    <ETableHeaderTwo
      v-drag-select2
      ref="ETableHeaderTwo"
      :border="true"
      :data="tableInfo.data" 
      :columns="tableInfo.columns"
      :rules="tableInfo.rules"
      :hideConfig="tableInfo.hideConfig"
      @dataChange="dataChange"
      >
    </ETableHeaderTwo>
  </div>
  </div>
</template>

<script>
// import ETableHeaderOne from '@/components/ETableHeaderOne'
import ETableHeaderTwo from '@/components/ETableHeaderTwo'
export default {
  name: "HelloWorld",
  components: {
    // ETableHeaderOne,
    ETableHeaderTwo,
  },
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
      tableInfo:{
        data: [],
        columns: [
          {
            label: "员工姓名1111",
            prop: "userName",
            colType: 'input'
          },
          {
            label: "员工号2222",
            prop: "userCode",
            colType: 'input'
          },
          {
            label: "角色3333",
            prop: "userRole",
            colType: 'input'
          }
        ],
        rules:{
          two: [{ required: true, message: '请输入员工号', trigger: ['blur'] }],
        },
        hideConfig: ['checkbox','serial'],
      },
      columns:[
        {
            colType: 'input',
            prop: 'ccc',
            slotname: ['bbb'],
            children: [
              {
                slotname: ['bbb'],
                prop: 'bbb',
                colType: 'slot'
              }
            ]
        },
        {
            slotname: ['aaa'],
            prop: 'aaa',
            colType: 'slot'
        }
      ]
    }
  },
  mounted() {
    console.log(window.WTJS)
    this.tableInfo.data = [
      {
        userName:'11',
        userCode:'222',
        userRole:'3333',
      },
      {
        userName:'11',
        userCode:'222',
        userRole:'333',
      },
      {
        userName:'11',
        userCode:'222',
        userRole:'333',
      }
      ,
      {
        userName:'11',
        userCode:'222',
        userRole:'333',
      }
      ,
      {
        userName:'11',
        userCode:'222',
        userRole:'333',
      }
      ,
      {
        userName:'11',
        userCode:'222',
        userRole:'333',
      }
      ,
      {
        userName:'11',
        userCode:'222',
        userRole:'333',
      }
      ,
      {
        userName:'11',
        userCode:'222',
        userRole:'333',
      }
    ]
  },
  methods: {
    dataChange(val){
      console.log(val)
    },
    async transport(){
      let aa = await this.$refs.EditTable.confirmRule()
      console.log(aa)
      // window.WTJS.transport.send({
      //   type: "event_click_nav",
      //   fromId: "dvergfcedfv",
      //   isTrack: true,
      // })
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


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
    <!-- <div class="table_box">
    <ETableHeaderTwo
      ref="ETableHeaderTwo"
      :border="true"
      :isSelectCopy="true"
      :data.sync="tableInfo.data" 
      :columns="tableInfo.columns"
      :rules="tableInfo.rules"
      :hideConfig="tableInfo.hideConfig"
      @dataChange="dataChange"
      >
    </ETableHeaderTwo>
  </div> -->
  <textarea ref="clipboardData" id="clipboardData"></textarea>
  </div>
</template>

<script>
// import ETableHeaderOne from '@/components/ETableHeaderOne'
// import ETableHeaderTwo from '@/components/ETableHeaderTwo'
import * as XLSX from 'xlsx';
export default {
  name: "HelloWorld",
  components: {
    // ETableHeaderOne,
    // ETableHeaderTwo,
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
            children:[
              {
                label: "年度标准",
                prop: "code4",
                colType: 'input',
              },
              {
                label: "季度标准",
                prop: "code5",
              },
            ]
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
    // 监听粘贴事件
    this.$refs.clipboardData.addEventListener('paste', this.handlePaste);
    this.tableInfo.data = [
      {
        userName:'11',
        userCode:'22',
        userRole:'33',
        code4:'666',
      },
      {
        userName:'111',
        userCode:'',
        userRole:'',
        code4:'',
      },
      {
        userName:'',
        userCode:'',
        userRole:'',
        code4:'',
      }
      ,
      {
        userName:'',
        userCode:'',
        userRole:'',
        code4:'',
      }
      ,
      {
        userName:'',
        userCode:'',
        userRole:'',
        code4:'',
      }
    ]
  },
  methods: {
    async handlePaste(e) {
      try {
        // 获取剪贴板中的文本数据
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        // 按行分割文本数据
        const lines = text.split('\n');
        // 初始化一个空数组来存储解析后的数据
        const parsedData = [];
        // 遍历每一行
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // 按列分割每一行的数据
          const cells = line.split('\t'); // 假设数据是用制表符分隔的
          // 遍历每个单元格
          for (let j = 0; j < cells.length; j++) {
            const cell = cells[j].trim(); // 去除单元格内的空白字符
            // 将单元格数据及其行列位置存储到解析后的数组中
            parsedData.push({
              value: cell,
              row: i + 1, // 行号通常是从1开始的
              col: j + 1  // 列号通常也是从1开始的
            });
          }
        }
        // 输出解析后的数据
        console.log(parsedData);
        // 在这里可以进一步处理parsedData，比如显示在页面上或发送到服务器
      } catch (error) {
        console.error('Error reading clipboard data:', error);
      }
    },
    extractData(data) {
      console.log(XLSX)
      const workbook = XLSX.read(data, { type: 'clipboard' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      for (let row = 0; row < jsonData.length; row++) {
        for (let col = 0; col < jsonData[row].length; col++) {
          const value = jsonData[row][col];
          const rowNumber = row + 1;
          const columnNumber = col + 1;
          console.log('Row:', rowNumber, 'Column:', columnNumber, 'Value:', value);
        }
      }
    },

    callBack(val){
      console.log(val)
    },
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
  padding: 20px;
}
</style>


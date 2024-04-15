<template>
    <div class="hello" >
      <el-button type="primary">主要按钮</el-button>
      <div class="table_box">
        <el-table
        ref="myTable"
          :data="tableData"
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
    directives: {
    dragSelect: {
      bind(el, binding, vnode) {
        let startX, startY, endX, endY;

        function handleMouseDown(event) {
          startX = event.clientX;
          startY = event.clientY;

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }

        function handleMouseMove(event) {
          endX = event.clientX;
          endY = event.clientY;
        }

        function handleMouseUp() {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);

          const table = vnode.context.$refs.myTable;
          const cells = table.$el.querySelectorAll('td');

          const minRowIndex = Math.min(startY, endY);
          const maxRowIndex = Math.max(startY, endY);
          const minCellIndex = Math.min(startX, endX);
          const maxCellIndex = Math.max(startX, endX);

          const selectedData = [];

          cells.forEach(cell => {
            const rect = cell.getBoundingClientRect();

            if (
              rect.top >= minRowIndex &&
              rect.bottom <= maxRowIndex &&
              rect.left >= minCellIndex &&
              rect.right <= maxCellIndex
            ) {
              const columnProp = cell.getAttribute('data-prop');
              const columnName = cell.getAttribute('data-name');
              const rowIndex = cell.parentNode.rowIndex;
              const columnIndex = cell.cellIndex;

              const cellData = {
                prop: columnProp,
                name: columnName,
                row: rowIndex,
                column: columnIndex,
                value: cell.textContent
              };

              selectedData.push(cellData);

              cell.style.backgroundColor = 'rgba(0, 0, 255, 0.4)';
            } else {
              cell.style.backgroundColor = '';
            }
          });

          console.log(selectedData);
        }

        el.addEventListener('mousedown', handleMouseDown);
      }
    }
  },
    // eslint-disable-next-line vue/multi-word-component-names
    name: "test",
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

    },
    beforeDestroy() {
    },
    methods: {

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
  
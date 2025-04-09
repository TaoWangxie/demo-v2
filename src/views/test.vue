<template>
  <div class="MyHome">
    <Table
      ref="tableRef"
      :border="true"
      :columns="columns"
      :data.sync="tableData"
      :hideConfig="hideConfig"
      :allSlot="true"
      :allSlotExceptColumnIndexs="[0]"
      :allHeaderSlot="true"
      :COLUMN_OFFSET="1"
      :pagination="pagination"
      @handlePageChange="handlePageChange"
    >
      <!-- 表头插槽 -->
      <template #header="{ scope }"> {{ scope.$column.label }} </template>
      <!-- 插槽 -->
      <template #default="{ scope }">
        <div
          v-if="scope.$data.row.tasks.length && getTask(scope)"
          class="taskCell"
        >
          <div
            v-for="(task, index) in getTask(scope)"
            class="task"
            :style="{ width: task.width }"
            :key="index"
          >
            <el-popover placement="right" width="200" trigger="click">
              <div
                slot="reference"
                :style="{
                  marginLeft: task.paddingL,
                  marginRight: task.paddingR,
                }"
                class="taskContent"
              >
                {{ task.name }}
              </div>
              <div>名字：{{ task.name }}</div>
            </el-popover>
          </div>
        </div>
      </template>
    </Table>
  </div>
</template>
  
<script>
import Table from "@/components/Table.vue";
export default {
  name: "MyHome",
  components: {
    Table,
  },
  data() {
    return {
      columns: [
        {
          label: "车辆",
          prop: "car",
          attr: {
            fixed: "left",
            width: "140px",
          },
        },
        {
          label: "1",
          prop: "code1",
        },
        {
          label: "2",
          prop: "code2",
        },
        {
          label: "3",
          prop: "code3",
        },
        {
          label: "4",
          prop: "code4",
        },
        {
          label: "5",
          prop: "code5",
        },
        {
          label: "6",
          prop: "code6",
        },
        {
          label: "7",
          prop: "code7",
        },
        {
          label: "8",
          prop: "code8",
        },
        {
          label: "9",
          prop: "code9",
        },
        {
          label: "10",
          prop: "code10",
        },
        {
          label: "11",
          prop: "code11",
        },
        {
          label: "12",
          prop: "code12",
        },
        {
          label: "13",
          prop: "code13",
        },
        {
          label: "14",
          prop: "code14",
        },
      ],
      tableData: [
        {
          car: "GVHBJJ",
          tasks: [
            { date: [1, 2], timeStart: 13, timeEnd: 14, name: "1" },
            { date: [2, 5], timeStart: 14, timeEnd: 5, name: "2" },
            { date: [5, 10], timeStart: 14, timeEnd: 8, name: "3" },
          ],
        },
        {
          car: "IJIKKO",
          tasks: [{ date: [3, 5], timeStart: 4, timeEnd: 3, name: "33" }],
        },
        {
          car: "YUUTT",
          tasks: [
            { date: [2, 6], timeStart: 8, timeEnd: 8, name: "55" },
            { date: [7, 9], timeStart: 6, timeEnd: 13, name: "44" },
          ],
        },
        {
          car: "eivom",
          tasks: [],
        },
      ],
      hideConfig: ["checkbox", "serial"],
      pagination: {
        pageSize: 10,
        pageNum: 1,
        total: 20,
      },
    };
  },
  methods: {
    //是否是任务第一天 用于插槽
    getTask(scope) {
      //scope：当前行插槽信息
      let tasks = scope.$data.row.tasks; //当前行任务列表
      let mergedRanges = this.$refs.tableRef.getMergedRanges(tasks, 1, 1); //当前行合并单元格区间列表
      let columnIndex = scope.$columnIndex; //当前插槽列下标（因为用的全插槽allSlot 所以每一cell的列下标都有）
      let fds = mergedRanges.map((item) => item.start); //fristDayStart 当前行所有合并单元格的起始日期 天，也是每个任务插槽的起始列
      let ind = fds.indexOf(columnIndex); //当前列是否是 等于 当前行某个合并单元格起始值
      if (ind > -1) {
        //存在
        let start = mergedRanges[ind].start; //单元格区间起始值
        let end = mergedRanges[ind].end; //单元格区间终止值
        // 合并单元格的区间内cell个数
        let interval = end - start + 1;
        let mergedTasks = []; //当前单元格范围内的所有任务列表
        tasks.forEach((task) => {
          if (task.date[0] >= start && task.date[0] <= end) {
            task["interval"] = interval;
            mergedTasks.push(task);
          }
        });
        // 合并单元格的区间内task任务个数
        let mergedTasksLen = mergedTasks.length;
        if (mergedTasksLen > 1) {
          //合并单元格内多任务
          mergedTasks.forEach((task, index) => {
            let offset = index == 0 || index == mergedTasksLen - 1 ? 0.5 : 0;
            let { width, paddingL, paddingR } = this.getTaskStyle(task, offset);
            task["width"] = width;
            task["paddingL"] = index == 0 ? paddingL : 0;
            task["paddingR"] = index == mergedTasksLen - 1 ? paddingR : 0;
          });
        } else {
          //合并单元格内单任务
          mergedTasks.forEach((task) => {
            let { paddingL, paddingR } = this.getTaskStyle(task, 1);
            task["width"] = `100%`;
            task["paddingL"] = paddingL;
            task["paddingR"] = paddingR;
          });
        }
        return mergedTasks;
      } else {
        return false;
      }
    },
    //获取每个任务的宽以及 am/pm 前后padding
    getTaskStyle(task, offset) {
      const len = Number(task.date[1]) - Number(task.date[0]) + offset;
      const halfW = `${100 / (len * 2)}%`;
      const width = `${(len / task.interval) * 100}%`;
      if (task.interval < 2) return { width: `100%`, paddingL: 0, paddingR: 0 };
      return {
        width: width,
        paddingL: task.timeStart > 12 ? halfW : "0px",
        paddingR: task.timeEnd < 12 ? halfW : "0px",
      };
    },
    handlePageChange(val) {
      console.log(val, this.pagination);
    },
  },
};
</script>
  
<style lang="scss" scoped>
.MyHome {
  width: 100%;
}
.taskCell {
  display: flex;
  width: 100%;
  .task {
    display: flex;
    min-width: 10px;
  }
  .taskContent {
    flex: 1;
    text-align: left;
    box-sizing: border-box;
    padding: 0 5px;
    border-left: 2px solid #409eff;
    background: rgba(64, 158, 255, 0.4);
  }
}
</style>
<style>
.task span {
  flex: 1;
}
</style>
  
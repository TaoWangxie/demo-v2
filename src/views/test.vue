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
          class="taskCell"
          v-if="scope.$data.row.tasks.length && getTask(scope)"
        >
          <div
            v-for="(task, index) in getTask(scope)"
            class="taskBox"
            :key="index"
          >
            <div class="taskBL" :style="{ width: halfW(task, true) }"></div>
            <div class="taskContent">
              {{ task.name }}
            </div>
            <div class="taskBR" :style="{ width: halfW(task, false) }"></div>
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
            { date: [1, 2], timeStart: 8, timeEnd: 8, name: "11" },
            { date: [2, 5], timeStart: 14, timeEnd: 8, name: "22" },
            { date: [6, 7], timeStart: 14, timeEnd: 8, name: "2222" },
          ],
        },
        {
          car: "IJIKKO",
          tasks: [{ date: [3, 5], timeStart: 13, timeEnd: 8, name: "33" }],
        },
        {
          car: "YUUTT",
          tasks: [
            { date: [6, 9], timeStart: 17, timeEnd: 8, name: "44" },
            { date: [2, 3], timeStart: 8, timeEnd: 8, name: "55" },
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
        let task = []; //当前单元格范围内的所有任务列表
        tasks.forEach((item) => {
          if (item.date[0] >= start && item.date[0] <= end) {
            task.push(item);
          }
        });
        return task;
      } else {
        return false;
      }
      // let columnIndex = scope.$columnIndex; //当前插槽列下标（因为用的全插槽allSlot 所以每一cell的列下标都有）
      // let fds = tasks.map((item) => item.date[0]); //fristDayStart 当前行所有任务的时间范围起始日期 天，也是每个任务插槽的起始列
      // if (fds.includes(columnIndex)) {
      //   //当任务插槽的起始列是当前列时，说明当前任务从这一天开始 返回当前任务对象 task
      //   let task = tasks.find((item) => item.date[0] == columnIndex);
      //   return task;
      // } else {
      //   return false;
      // }
    },
    //任务第一天/最后一天 am/pm
    halfW(row, isFirstDay) {
      const len = Number(row.date[1]) - Number(row.date[0]);
      const halfW = `${100 / ((len + 1) * 2)}%`;
      // 根据日期类型判断条件
      if (isFirstDay) {
        return row.timeStart > 12 ? halfW : "0px"; // 网页1中的时间判断逻辑
      } else {
        return row.timeEnd < 12 ? halfW : "0px"; // 网页1中的时间判断逻辑
      }
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
  .taskBox {
    display: flex;
    width: 100%;
  }
  .taskBL {
    height: 100%;
    border-right: 2px solid #409eff;
  }
  .taskBR {
    height: 100%;
  }
  .taskContent {
    flex: 1;
    text-align: left;
    background: rgba(64, 158, 255, 0.4);
  }
}
</style>
  
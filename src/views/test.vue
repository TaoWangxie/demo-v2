<template>
  <div class="MyHome">
    <Table
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
            class="taskBL"
            :style="{ width: halfW(getTask(scope), true) }"
          ></div>
          <div class="taskContent">
            {{ getTask(scope).name }}
          </div>
          <div
            class="taskBR"
            :style="{ width: halfW(getTask(scope), false) }"
          ></div>
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
            { date: [5, 8], timeStart: 14, timeEnd: 8, name: "22" },
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
      let columnIndex = scope.$columnIndex; //当前插槽列下标（因为用的全插槽allSlot 所以每一cell的列下标都有）
      let fds = tasks.map((item) => item.date[0]); //fristDayStart 当前行所有任务的时间范围起始日期 天，也是每个任务插槽的起始列
      if (fds.includes(columnIndex)) {
        //当任务插槽的起始列是当前列时，说明当前任务从这一天开始 返回当前任务对象 task
        let task = tasks.find((item) => item.date[0] == columnIndex);
        return task;
      } else {
        return false;
      }
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
  height: 100%;

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
  
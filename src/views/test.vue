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
      :pagination="pagination"
      @handlePageChange="handlePageChange"
    >
      <!-- 表头插槽 -->
      <template #header="{ scope }"> {{ scope.$column.label }} </template>
      <!-- 插槽 -->
      <template #default="{ scope }">
        <div
          v-if="
            scope.$data.row.task.length &&
            getFirstDay(scope.$data.row.task, scope.$columnIndex)
          "
          class="taskCell"
        >
          <!-- <div
            class="taskBL"
            :style="{ width: halfW(scope.$data.row, true) }"
          ></div> -->
          <div class="taskContent">{{ scope.$data.row.name }}</div>
          <!-- <div
            class="taskBR"
            :style="{ width: halfW(scope.$data.row, false) }"
          ></div> -->
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
          task: [{ date: [1, 2] }, { date: [5, 8] }],
          timeStart: 8,
          timeEnd: 8,
          name: "1111",
        },
        {
          car: "IJIKKO",
          task: [{ date: [3, 5] }],
          timeStart: 13,
          timeEnd: 8,
          name: "2222",
        },
        {
          car: "YUUTT",
          task: [{ date: [6, 9] }, { date: [2, 3] }],
          timeStart: 8,
          timeEnd: 18,
          name: "3333",
        },
        {
          car: "eivom",
          task: [],
          name: "4444",
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
    getFirstDay(task, columnIndex) {
      let fds = task.map((item) => {
        return item.date[0] + 1;
      });

      return fds.includes(columnIndex);
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
  
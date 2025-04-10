<template>
  <div class="MyHome">
    <!-- <Table
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
      <template #header="{ scope }"> {{ scope.$column.label }} </template>
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
    </Table> -->
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
        <div v-if="scope.$data.row.tasks.length" class="taskCell">
          <div
            v-for="(task, index) in getTaskList(scope)"
            class="taskSpan"
            :key="index"
            :style="{
              background: task.length ? 'rgba(64, 158, 255, 0.4)' : '',
            }"
          >
            <el-popover
              placement="right"
              :key="index"
              width="200"
              trigger="click"
            >
              <div class="taskCard" v-for="(item, index) in task" :key="index">
                {{ item.name }}
              </div>
              <div v-if="task.length" slot="reference" class="taskBox">
                <template v-for="(item, ind) in task">
                  <div
                    v-if="item.first"
                    :key="ind"
                    class="taskInfo"
                    :style="{
                      borderLeft: item.first ? '2px solid #409eff' : '',
                    }"
                  >
                    <div class="taskInfoTitle">{{ item.statusName }}</div>
                    <div class="taskInfoText">{{ item.name }}</div>
                    <div class="taskInfoText">{{ item.tel }}</div>
                  </div>
                </template>
              </div>
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
            width: "160px",
          },
        },
        {
          label: "1",
          prop: "code1",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "2",
          prop: "code2",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "3",
          prop: "code3",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "4",
          prop: "code4",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "5",
          prop: "code5",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "6",
          prop: "code6",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "7",
          prop: "code7",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "8",
          prop: "code8",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "9",
          prop: "code9",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "10",
          prop: "code10",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "11",
          prop: "code11",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "12",
          prop: "code12",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "13",
          prop: "code13",
          attr: {
            minWidth: "120px",
          },
        },
        {
          label: "14",
          prop: "code14",
          attr: {
            minWidth: "120px",
          },
        },
      ],
      tableData: [
        {
          car: "GVHBJJ",
          tasks: [
            {
              id: 1,
              date: [1, 2],
              timeStart: 8,
              timeEnd: 5,
              name: "任务1",
              status: 0,
              statusName: 111,
              tel: 122222222222,
            },
            {
              id: 2,
              date: [2, 5],
              timeStart: 4,
              timeEnd: 13,
              name: "任务2",
              status: 0,
              statusName: 111,
              tel: 122222222222,
            },
            {
              id: 3,
              date: [7, 10],
              timeStart: 14,
              timeEnd: 14,
              name: "任务3",
              status: 0,
              statusName: 111,
              tel: 122222222222,
            },
          ],
        },
        {
          car: "IJIKKO",
          tasks: [
            {
              id: 4,
              date: [3, 3],
              timeStart: 13,
              timeEnd: 13,
              name: "任务4",
              status: 0,
              statusName: 111,
              tel: 122222222222,
            },
          ],
        },
        // {
        //   car: "YUUTT",
        //   tasks: [
        //     { id: 5, date: [2, 4], timeStart: 8, timeEnd: 8, name: "任务5" },
        //     { id: 6, date: [5, 9], timeStart: 17, timeEnd: 8, name: "任务6" },
        //   ],
        // },
        // {
        //   car: "eivom",
        //   tasks: [],
        // },
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
    getTaskList(scope) {
      let tasks = scope.$data.row.tasks; //当前行任务列表
      let mergedRanges = this.$refs.tableRef.getMergedRanges(tasks, 1, 1); //当前行合并单元格区间列表
      let columnIndex = scope.$columnIndex; //当前插槽列下标（因为用的全插槽allSlot 所以每一cell的列下标都有）
      let fds = mergedRanges.map((item) => item.start); //fristDayStart 当前行所有合并单元格的起始日期 天，也是每个任务插槽的起始列
      let ind = fds.indexOf(columnIndex); //当前列是否是 等于 当前行某个合并单元格起始值
      if (ind > -1) {
        let start = mergedRanges[ind].start; //单元格区间起始值
        let end = mergedRanges[ind].end; //单元格区间终止值
        let result = this.generateSchedule(tasks, [start, end]);
        return result;
      } else {
        return [];
      }
    },
    generateSchedule(tasks, targetDateRange) {
      const [startDay, endDay] = targetDateRange;
      const interval = (endDay - startDay + 1) * 2;
      const result = Array.from({ length: interval }, () => []);
      const firstOccurrence = {}; // 记录每个name首次出现的索引位置
      tasks.forEach((task) => {
        const [taskStartDay, taskEndDay] = task.date;
        if (taskStartDay < startDay || taskEndDay > endDay) return;
        // 计算索引范围（逻辑与之前一致）
        const baseStartIndex = (taskStartDay - startDay) * 2;
        const baseEndIndex = (taskEndDay - startDay + 1) * 2 - 1;
        let adjustedStart = baseStartIndex + (task.timeStart > 12 ? 1 : 0);
        let adjustedEnd =
          task.timeEnd < 12 ? (taskEndDay - startDay) * 2 : baseEndIndex;
        adjustedStart = Math.max(adjustedStart, 0);
        adjustedEnd = Math.min(adjustedEnd, interval - 1);

        // 填充任务并标记首次出现
        for (let i = adjustedStart; i <= adjustedEnd; i++) {
          const curTask = task.id;
          // 若当前name从未被标记过首次出现
          if (!(curTask in firstOccurrence)) {
            firstOccurrence[curTask] = i; // 记录首次出现的索引
            result[i].push({ ...task, first: true }); // 添加 first: true
          } else {
            // 若当前索引是该name的首次出现位置，则标记
            const isFirstPosition = i === firstOccurrence[curTask];
            result[i].push(isFirstPosition ? { ...task, first: true } : task);
          }
        }
      });
      console.log(result);

      return result;
    },
    //=====================================
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
        console.log(mergedTasks);

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
  height: 100%;
  .taskSpan {
    flex: 1;
    font-size: 12px;
  }
  .taskBox {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    .taskInfo {
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 100%;
      text-align: left;
      padding: 0 4px;
    }
    .taskInfoTitle {
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
    }
    .taskInfoText {
      font-size: 12px;
      line-height: 13px;
    }
  }
  // .taskContent {
  //   flex: 1;
  //   text-align: left;
  //   box-sizing: border-box;
  //   padding: 0 5px;
  //   border-left: 2px solid #409eff;
  //   background: rgba(64, 158, 255, 0.4);
  // }
}
</style>
<style>
.taskCell span {
  flex: 1;
}
</style>
  
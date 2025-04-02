<template>
  <div class="MyHome">
    <Table
      :border="true"
      :columns="columns"
      :data.sync="tableData"
      :hideConfig="hideConfig"
      :allSlot="true"
      :allHeaderSlot="true"
    >
      <template #header="{ scope }"> {{ scope.column.label }} </template>
      <template #default="{ scope }">
        <div
          v-if="
            scope.scope.row.date.length &&
            scope.columnIndex == scope.scope.row.date[0]
          "
          style="width: 100%; height: 100%; background: rgba(64, 158, 255, 0.4)"
        ></div>
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
          date: [1, 2],
        },
        {
          car: "IJIKKO",
          date: [6, 10],
        },
        {
          car: "YUUTT",
          date: [2, 9],
        },
        {
          car: "eivom",
          date: [],
        },
      ],
      hideConfig: ["checkbox", "serial"],
    };
  },
  methods: {},
};
</script>
  
<style lang="scss" scoped>
.MyHome {
  width: 100%;
  //   width: 600px;
}
</style>
  
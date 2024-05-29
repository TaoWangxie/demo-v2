<template>
    <div
      class="gridTag_box"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
    >
      <div class="gridTag_Item" v-for="(item, index) in gridTags" :key="index">
        <div class="mask" draggable="true" :data-index="index"></div>
        <div class="imgBox">
          <img :src="item.src" alt="" />
        </div>
        <div class="textBox">
          {{ item.label }}
        </div>
      </div>
    </div>
</template>
<script>
export default {
    name: "HeaderBar",
    components: {},
    data() {
        return {
            gridTags: [
                {
                    id: "0",
                    label: "文本",
                    comKey: "RectangleNew",
                    isSlot: true,
                    src: "",
                    config:{}
                }
            ],
        };
    },
    methods:{
      handleDragStart(e){

      },
      handleDragEnd(){}
    }
};
</script>
<style lang="scss" scoped>
.gridTag_box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: auto;
  padding: 5%;
  background-color: #f2f6fc;
}
.gridTag_Item {
  // display: flex;
  position: relative;
  flex: 0 0 45%;
  // height: 80px;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 4px;
  margin-right: calc(10%);
  margin-bottom: 15px;
  &:nth-child(2n) {
    margin-right: 0;
  }
  &:last-child {
    margin-right: auto;
  }
  .imgBox {
    width: 100%;
    height: 50px;
    padding: 10px 0;
    background-color: #ebeef5;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      display: inline-block;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .textBox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 30px;
    font-size: 12px;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>

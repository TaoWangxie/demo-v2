<template>
    <div class="side">
        <div class="side_ul">
            <div
                :class="[ 'side_li',
                    activeIndex == menuChild.path ? 'active' : '',
                ]"
                v-for="menuChild in menuList"
                :key="menuChild.path"
                :index="menuChild.path"
                @click="menuItemClick(menuChild)"
            >
                {{ menuChild.mate.title }}
            </div>
        </div>
    </div>
</template>
<script>
import { routes } from "@/router";
export default {
    name: "SideNar",
    components: {},
    data() {
        return {
            menuList: [],
            activeIndex: ''
        };
    },
    mounted(){
        this.menuList = routes[0].children
        this.activeIndex = routes[0].redirect.path
    },
    methods: {
        menuItemClick(item){
            if(item.path === this.activeIndex) return
            this.$router.push(item.path);
            this.activeIndex = item.path
        }
    },

};
</script>

<style lang="scss" scoped>
.side {
  position: relative;
  width: 240px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #626aef;
  flex-shrink: 0;
  user-select: none;
}
.side_ul {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 30px 0;
  padding-right: 15px;
  box-sizing: border-box;
  top: 0;
  left: 0;
  .side_li {
    display: flex;
    height: 45px;
    align-items: center;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    border-radius: 0 7px 7px 0;
    margin-bottom: 15px;
    padding: 0 15px;
    &:hover {
      cursor: pointer;
    }
    span {
      display: inline-block;
      margin: 0 20px 0 40px;
    }
  }
  .active {
    background-color: rgba(255, 255, 255, 0.15);
  }
}
.imgbox {
  position: absolute;
  width: 100%;
  height: 250px;
  // background-color: rgba(255, 255, 255, 0.15);
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
  
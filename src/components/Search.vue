<template>
    <div class="Search">
      <div class="custom-search">
        <div class="custom-search-input">
          <input
            v-model="keyword"
            type="text"
            class="custom-search-input-inner"
            :placeholder="placeholder"
            @input="handleInput"
          />
          <img
            v-if="showClear"
            src="@/assets/images/search.png"
            class="custom-search-clear-icon"
            @click="clearInput"
            alt="附件"
          />
        </div>
        <div v-if="showAction" class="custom-search-action">
          <span class="custom-search-action-text" @click="handleActionClick">{{
            actionText
          }}</span>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: "Search",
    props: {
      value: {
        type: String,
        default: "",
      },
      placeholder: {
        type: String,
        default: "",
      },
      showClear: {
        type: Boolean,
        default: true,
      },
      showAction: {
        type: Boolean,
        default: false,
      },
      actionText: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        keyword: "",
      };
    },
    mounted() {
      this.keyword = this.value;
    },
    watch: {
      value(newVal) {
        this.keyword = newVal;
      },
    },
    methods: {
      handleInput(event) {
        this.keyword = event.target.value;
        this.$emit("input", this.keyword);
      },
      clearInput() {
        this.keyword = "";
        this.$emit("input", "");
      },
      handleActionClick() {
        this.$emit("action");
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  $n: 1rem/32;
  .Search {
    padding: 12 * $n 32 * $n;
    background-color: #fff;
  }
  .custom-search {
    display: flex;
    align-items: center;
    background-color: #f7f8fa;
    border-radius: 30 * $n;
    height: 60 * $n;
  }
  
  .custom-search-input {
    flex: 1;
    height: 100%;
    padding: 12 * $n 30 * $n 12 * $n 64 * $n;
    box-sizing: border-box;
    position: relative;
  }
  
  .custom-search-input-inner {
    width: 100%;
    border: none;
    outline: none;
    height: 100%;
    background-color: transparent;
    font-size: 26 * $n;
    padding-right: 30 * $n;
    box-sizing: border-box;
  }
  
  .custom-search-clear-icon {
    position: absolute;
    top: 50%;
    left: 16 * $n;
    transform: translateY(-50%);
    display: inline-block;
    width: 40 * $n;
    height: 40 * $n;
    background-size: cover;
    cursor: pointer;
  }
  
  .custom-search-action {
    margin-left: 8 * $n;
  }
  
  .custom-search-action-text {
    color: #1989fa;
    font-size: 14 * $n;
    line-height: 1;
    cursor: pointer;
  }
  </style>
    
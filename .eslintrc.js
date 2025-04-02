module.exports = {
    parser: "vue-eslint-parser", // 关键配置 [3](@ref)
    parserOptions: {
      parser: "@babel/eslint-parser", // 支持 ES6+ 语法
      sourceType: "module",
      ecmaVersion: 2022
    }
}
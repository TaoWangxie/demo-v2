const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  server: {
    port: 5002 // 设置端口号为 3001
  }
})

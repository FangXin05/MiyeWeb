<script setup>
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
// 拿路由工具和用户仓库
</script>

<template>
  <el-config-provider :locale="zh">
    <router-view />
  </el-config-provider>
</template>

<style scoped></style>

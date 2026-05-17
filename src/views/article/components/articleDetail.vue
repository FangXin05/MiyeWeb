<template>
  <el-drawer v-model="visibleDrawer" title="谜题详细" size="50%">
    <el-descriptions :column="1" border v-if="article.id">
      <template #title>
        <h2>{{ article.title }}</h2>
      </template>
    </el-descriptions>

    <p style="color: #888; margin-bottom: 16px">
      谜题作者：{{ article.username }} <br />
      发布时间：{{ formatTime(article.pub_date) }} <br />谜题分类：{{ article.cate_name }}
    </p>

    <el-divider />

    <img
      v-if="article.cover_img"
      :src="baseURL + article.cover_img"
      style="max-width: 100%; max-height: 1000px; object-fit: contain; margin-bottom: 16px"
    />

    <div v-html="article.content"></div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue' // 响应式
import { ArticlegetDetail } from '@/api/article' //文章详细
import { formatTime } from '@/utils/format' //时间
import { baseURL } from '@/utils/request' //文章封面
const visibleDrawer = ref(false) //抽屉一开始是隐藏状态
const article = ref({}) //文章是响应式对象
const open = async (row) => {
  visibleDrawer.value = true //打开抽屉
  const res = await ArticlegetDetail(row.id) //获取文章详细
  article.value = res.data //赋值给article
}
defineExpose({ open })
</script>

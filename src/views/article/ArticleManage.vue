<template>
  <page-container title="谜题管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加谜题</el-button>
    </template>
    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="谜题分类">
        <!-- Vue2=>v-model:value 和 @input 的简写 
        Vue3=>v-model :modelValue 和 @update:modelValue 的简写 -->
        <channel-select v-model="params.cate_id" style="width: 150px"></channel-select>
      </el-form-item>

      <el-form-item label="发布状态">
        <el-select style="width: 150px" v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜查</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form item></el-form>
    <el-form item></el-form>
    <!-- 表格区域 -->
    <el-table :data="articleList" style="width: 100%" v-loading="Loading">
      <el-table-column label="谜题标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" @click="onViewArticle(row)">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next, "
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; display: flex; justify-content: center"
    />
    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"> </article-edit>
    <article-detail ref="articleDetailRef"></article-detail>
  </page-container>
</template>

<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import channelSelect from '@/views/article/components/channelSelect.vue'
import { getArticleList, deleteArticle } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
import articleEdit from '@/views/article/components/articleEdit.vue'
import articleDetail from '@/views/article/components/articleDetail.vue'
const articleDetailRef = ref()
const onViewArticle = (row) => {
  articleDetailRef.value.open(row)
}
const total = ref(0)
const articleList = ref([])
const Loading = ref(false) // 创建一个响应式变量，初始为 false（不显示loading）
//定义请求参数对象
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: '',
})
// 基于params参数获取文章列表
const getTextList = async () => {
  Loading.value = true // 请求开始前：显示loading
  const res = await getArticleList(params.value) // 发起网络请求
  articleList.value = res.data
  total.value = res.total
  Loading.value = false // 请求结束后：隐藏loading
}
getTextList()
// const cateId = ref(44173)

// 删除
const onDeleteArticle = async (row) => {
  await deleteArticle(row.id)
  getTextList()
  ElMessage.success('删除成功')
}
// 处理分页逻辑
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getTextList()
}
// 处理当前页码改变逻辑
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getTextList()
}
//搜索
const onSearch = () => {
  params.value.pagenum = 1
  getTextList()
}
//重置
const onReset = () => {
  params.value.cate_id = ''
  params.value.state = ''
  params.value.pagenum = 1
  getTextList()
}
const articleEditRef = ref(null)
//添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}
// 编辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
//添加编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    //更新最大页码数
    params.value.pagenum = lastPage
  }
  getTextList()
}
</script>

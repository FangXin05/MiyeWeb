

<template>
  <page-container title="谜题分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%" highlight-current-row>
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="cate_name" label="谜题分类名称" />
      <el-table-column prop="cate_alias" label="谜题分类别名" />

      <el-table-column label="操作" width="150">
        <template #default="{ row, $index }">
          <el-button @click="onEditChannel(row, $index)" type="primary" :icon="Edit" circle plain />
          <el-button
            @click="onDeleteChannel(row)"
            type="danger"
            :icon="Delete"
            circle
            plain
          />
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="啥都没有捏~"></el-empty>
      </template>
    </el-table>
     <!-- 父组件：拿到子组件的引用 -->
    <channel-edit ref="dialog" @success="OnSuccess"></Channel-edit>
   
  </page-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getArticleChannelList, deleteArticleChannel } from '@/api/article'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from '@/views/article/components/channelEdit.vue'

const channelList = ref([])
const loading = ref(false)
//给子组件起个名字叫 dialog
const dialog = ref()

const getChannelList = async () => {
  try {
    loading.value = true
    const res = await getArticleChannelList()
    channelList.value = res.data
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  getChannelList()
})
const onEditChannel = (row) => {
  dialog.value.open(row)
}
//dialog.value 拿到子组件实例
// .open(row) 调用子组件的 open 方法，并把 row 传过去
const onDeleteChannel = async (row) => {
    await ElMessageBox.confirm('你确认要删除该分类吗？', '温馨提示', {
        type:'warning',
        confirmButtonText:'确定',
        cancelButtonText:'取消'
    })
    await deleteArticleChannel(row.id)
    ElMessage.success('删除成功')
    getChannelList()
}
const onAddChannel = () => {
  dialog.value.open({})
}
const OnSuccess = () => {
  getChannelList()
}
</script>

<style lang="scss" scoped></style>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="30%">
    <!-- 这里的弹窗title根据有无Id来进行变化，: 是 v-bind: 的简写，作用是把引号里的内容当作 JavaScript 代码执行，而不是普通字符串。 -->
    <el-form
      :model="formModel"
      ref="formRef"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="请输入分类别名" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import { addArticleChannel, updateArticleChannel } from '@/api/article'

const dialogVisible = ref(false)
const formRef = ref()

const open = async (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}
const formModel = ref({
  id: '',
  cate_name: '',
  cate_alias: '',
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名称只能是1—10数字', trigger: 'blur' },
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-zA-Z]{1,15}$/, message: '分类名必须是1-15的非空英文字符', trigger: 'blur' },
  ],
}
const emit = defineEmits(['success'])
const onSubmit = async () => {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  const isEdit = formModel.value.id
  if (isEdit) {
    await updateArticleChannel(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await addArticleChannel(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false // 关闭弹窗

  emit('success')
}

defineExpose({
  open,
})
</script>

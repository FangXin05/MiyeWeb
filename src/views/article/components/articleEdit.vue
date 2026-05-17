<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑谜题' : '添加谜题'"
    direction="rtl"
    size="50%"
  >
    <el-form :model="formModel" ref="formRef" label-width="100px" :rules="rules">
      <!--------------------------谜题标题区域----------------------->
      <el-form-item label="谜题标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <!------------------------谜题分类区域------------------------->
      <el-form-item label="谜题分类" prop="cate_id">
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <!----------------------谜题封面区域-------------------------->
      <el-form-item label="谜题封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <!---------------------文本编辑区域---------------------------->
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
            ref="editorRef"
          ></QuillEditor>
          <!-- 这里为什么不写formModel.value.content呢？答：在 <template> 里不需要写 .value，只有在 <script> 里才需要 -->
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import channelSelect from './channelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { addArticle } from '@/api/article'
import { ArticlegetDetail, artEditService } from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

//默认数据
const DefaultForm = ref({
  title: '',
  cate_id: '', //分类id
  cover_img: '', //封面图片file对象
  content: '', // string内容
  state: '', //状态
})

//准备数据
const formModel = ref({
  ...DefaultForm.value,
})
// 图片上传相关
const imgUrl = ref('')
const onSelectFile = (file) => {
  imgUrl.value = URL.createObjectURL(file.raw) // 预览图片
  formModel.value.cover_img = file.raw
}

//组件对外暴露一个方法 open,基于open传来的参数,区分添加还是编辑
// open({})=>表单无需渲染,说明是添加
// open({ id,., ... })=>表单需要渲染,说明是编辑
// open调用后,可以打开抽屉
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true //显示
  if (row.id) {
    const res = await ArticlegetDetail(row.id)
    formModel.value = res.data
    imgUrl.value = baseURL + formModel.value.cover_img // 单独回写封面图片预览 URL
    //注意，提交给后台需要的数据格式是file对象格式
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...DefaultForm.value } //基于默认的数据重置数组
    imgUrl.value = ''
    editorRef.value.setHTML('')
  }
}
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], { type: response.headers['content-type'] })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    throw error
  }
}

defineExpose({
  open,
})
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 20, message: '标题长度为 1-20 个字符', trigger: 'blur' },
  ],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  cover_img: [{ required: true, message: '请上传文章封面', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
}
const formRef = ref(null)
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state
  if (formModel.value.content === '<p><br></p>') {
    formModel.value.content = ''
  }
  const fd = new FormData() //FormData 是浏览器原生对象，专门用来打包表单数据
  for (let key in formModel.value) {
    //for...in 遍历 formModel 的每个字段，挨个塞进去
    fd.append(key, formModel.value[key])
  }
  //发请求
  if (formModel.value.id) {
    //编辑发布
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false //关闭抽屉
    emit('success', 'edit')
  } else {
    //添加
    await addArticle(fd)
    ElMessage.success('添加成功') //成功提示
    visibleDrawer.value = false //关闭抽屉
    emit('success', 'add')
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: auto;
      height: auto;
      max-width: 178px;
      max-height: 178px;
      display: block;
      object-fit: contain;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: visible;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>

<script setup>
//script setup里的内容直接暴露给模板使用
//-----------------------导入区---------------------------------
import { useUserStore } from '@/stores' //全局用户仓库，里面存放登陆用户的信息
import { ref } from 'vue' //定义响应式数据
import { userUpdateInfoService } from '@/api/user' //拿接口函数负责和后端通信
//组件负责页面，store 负责共享状态，api 负责请求后端
//-----------------------数据区---------------------------------
const {
  user: { username, nickname, email, id },
  getUser,
} = useUserStore()
const userInfo = ref({ username, nickname, email, id })
//-----------------------规则区---------------------------------
const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      // ^表示匹配开头 \S表示非空字符串 {2,10}表示长度限制 $表示匹配结尾
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  //   type: 'email' 是 Element Plus 表单校验自带的邮箱格式判断
}
//-----------------------引用区---------------------------------
const formRef = ref()
//-----------------------事件函数区---------------------------------
const OnSubmit = async () => {
  await formRef.value.validate()
  await userUpdateInfoService(userInfo.value)
  getUser()
  ElMessage.success('修改成功')
}
</script>

<template>
  <page-container title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" ref="formRef" label-width="100px" size="large">
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="OnSubmit">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

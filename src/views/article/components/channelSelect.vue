<template>
  <el-select
    :style="{ width }"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="channel in channelList"
      :label="channel.cate_name"
      :key="channel.id"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>

<script setup>
import { ref } from 'vue'
import { getArticleChannelList } from '@/api/article.js'

defineProps({
  modelValue: {
    type: [Number, String],
  },
  width: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async () => {
  const res = await getArticleChannelList()
  channelList.value = res.data
}
getChannelList()
</script>

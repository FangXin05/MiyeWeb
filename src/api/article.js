import request from '@/utils/request'

// 分类：获取文章分类
export const getArticleChannelList = () => request.get('/my/cate/list')
// 分类：添加文章分类
export const addArticleChannel = (data) => request.post('/my/cate/add', data)
// 分类：编辑文章分类
export const updateArticleChannel = (data) => request.put('/my/cate/info', data)
// 分类：删除文章分类
export const deleteArticleChannel = (id) => request.delete('/my/cate/del', { params: { id } })

// 文章：获取文章列表
export const getArticleList = (params) => request.get('/my/article/list', { params })
// 文章：添加文章
export const addArticle = (data) => request.post('/my/article/add', data)
// 文章：编辑文章
export const updateArticle = (data) => request.put('/my/article/info', data)
// 文章：删除文章
export const deleteArticle = (id) => request.delete('/my/article/del', { params: { id } })
//获取文章详情
export const ArticlegetDetail = (id) =>
  request.get('/my/article/info', {
    params: { id },
  })
//编辑文章接口
export const artEditService = (data) => request.put('/my/article/info', data)

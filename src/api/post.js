import { request } from './config'

// 获取帖子列表
export const getPostList = async (params) => {
  const { page, page_size, state } = params
  return request(`/get_posts?page=${page}&page_size=${page_size}&state=${state}`)
}

// 审核帖子
export const reviewPost = async (id, data) => {
  return request(`/posts/${id}/audit`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 删除帖子
export const deletePost = async (id) => {
  return request(`/delete_post/${id}`, {
    method: 'DELETE'
  })
} 
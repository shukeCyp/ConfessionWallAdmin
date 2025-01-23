import { request } from './config'

// 获取用户列表
export const getUserList = async (params) => {
  const { page, page_size, query } = params
  let url = `/get_users?page=${page}&page_size=${page_size}`
  if (query) {
    url += `&nickname=${query}`
  }
  return request(url)
}

// 添加用户
export const addUser = async (data) => {
  return request('/user', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// 更新用户
export const updateUser = async (id, data) => {
  return request(`/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

// 删除用户
export const deleteUser = async (id) => {
  return request(`/delete_user/${id}`, {
    method: 'DELETE'
  })
}

// 更新用户状态
export const updateUserStatus = async (id, status) => {
  return request(`/user/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
} 
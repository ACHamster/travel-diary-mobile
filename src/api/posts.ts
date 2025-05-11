import { get, post, put, del } from './request'

interface PostResponse {
  success: boolean
  data?: any
  error?: any
}

// 获取游记列表
export const fetchPosts = async (params?: { page?: number; pageSize?: number }): Promise<PostResponse> => {
  try {
    const res = await get('/posts/list', params)
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

// 获取已审核的游记列表
export const fetchApprovedPosts = async (params?: { page?: number; pageSize?: number }): Promise<PostResponse> => {
  try {
    const res = await get('/posts/list/approved', params);
    return { success: true, data: res }
  } catch (error) {
    return { success: false, error }
  }
}

// 获取当前用户的游记列表
export const fetchMyPosts = async (): Promise<PostResponse> => {
  try {
    const res = await get('/posts/my');
    return { success: true, data: res }
  } catch (error) {
    return { success: false, error }
  }
}

// 获取单篇游记详情
export const fetchPostById = async (id: string | number): Promise<PostResponse> => {
  try {
    const res = await get(`/posts/${id}`)
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

// 创建游记
export const createPost = async (data: {
  title: string
  content: string
  coverImage: string
  images: string[]
  video?: string
}): Promise<PostResponse> => {
  try {
    const res = await post('/posts', data)
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

// 更新游记
export const updatePost = async (
  id: string | number,
  data: {
    title?: string
    content?: string
    coverImage?: string
    tags?: string[]
  }
): Promise<PostResponse> => {
  try {
    const res = await put(`/posts/${id}`, data)
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

// 删除游记
export const deletePost = async (id: string | number): Promise<PostResponse> => {
  try {
    const res = await del(`/posts/${id}`)
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

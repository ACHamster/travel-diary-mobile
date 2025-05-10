import Taro from '@tarojs/taro'
import type { UserInfo } from './auth'
import { get } from './request'

interface UserResponse {
  success: boolean
  data?: UserInfo
  error?: any
}

// 获取用户完整信息
export const getUserInfo = async (id: string | number): Promise<UserResponse> => {
  try {
    const res = await get(`/user/info/${id}`)
    if (res.statusCode === 200) {
      // 更新本地存储的用户信息，合并现有信息和新获取的信息
      const currentUserInfo = Taro.getStorageSync('userInfo') || {}
      const newUserInfo = {
        ...currentUserInfo,
        ...res.data
      }
      Taro.setStorageSync('userInfo', newUserInfo)
      return { success: true, data: newUserInfo }
    }
    return { success: false, error: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

// 更新本地用户信息
export const updateLocalUserInfo = async (): Promise<UserResponse> => {
  try {
    const userId = Taro.getStorageSync('userId')
    if (!userId) {
      return { success: false, error: 'No user ID found' }
    }
    return await getUserInfo(userId)
  } catch (error) {
    return { success: false, error }
  }
}

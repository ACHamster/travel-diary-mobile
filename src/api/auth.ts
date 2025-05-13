import Taro from '@tarojs/taro'
import { get, post } from './request'

interface AuthResponse {
  success: boolean
  data?: any
  error?: any
}

export interface UserInfo {
  id: number
  username: string
  email: string
  avatar?: string | null
}

interface LoginResponse extends AuthResponse {
  data?: {
    token: string
    refreshToken: string
    user: UserInfo
  }
}

// 验证管理员身份
export const verifyAdmin = async (): Promise<AuthResponse> => {
  try {
    const res = await get('/auth/verifyadmin')
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

// 检查登录状态
export const checkLoginStatus = async (): Promise<AuthResponse> => {
  try {
    const res = await get('/auth/status')
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

// 用户登录
export const login = async (data: { username: string; password: string }): Promise<LoginResponse> => {
  try {
    const res = await post('/auth/signin', data);
    if (res.data) {
      // 保存token和用户信息
      Taro.setStorageSync('token', res.data.token)
      Taro.setStorageSync('refreshToken', res.data.refreshToken)
      Taro.setStorageSync('userInfo', res.data.userInfo)
      // 保存用户ID，方便后续获取完整信息
      Taro.setStorageSync('userId', res.data.userInfo.id)
    }
    return { success: true, data: res.data }
  } catch (error) {
    console.log(error);
    return { success: false, error }
  }
}

// 刷新token
export const refreshToken = async (): Promise<{success: boolean; error?: any}> => {
  try {
    const currentRefreshToken = Taro.getStorageSync('refreshToken')
    if (!currentRefreshToken) {
      return { success: false, error: 'No refresh token found' }
    }

    const res = await post('/auth/refresh', { refreshToken: currentRefreshToken })
    if (res.data?.token) {
      // 保存新的token
      Taro.setStorageSync('token', res.data.token)
      return { success: true }
    }
    return { success: false, error: 'Failed to refresh token' }
  } catch (error) {
    return { success: false, error }
  }
}

// 用户注销
export const logout = async (): Promise<AuthResponse> => {
  try {
    const res = await post('/auth/logout')
    // 清除本地存储的所有用户相关信息
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('refreshToken')
    Taro.removeStorageSync('userInfo')
    Taro.removeStorageSync('userId')
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error }
  }
}

export const signUp = async (data) => {
  try {
    const res = await post('/auth/signup', data)
    return { success: true, data: res }
  } catch (error) {
    return { success: false, error }
  }
}

import Taro from '@tarojs/taro'
import type { UserInfo } from './auth'
import {get, post} from './request'

interface UserResponse {
  success: boolean
  data?: UserInfo
  error?: any
}

// 获取用户完整信息
export const getUserInfo = async (id: string | number): Promise<UserResponse> => {
  try {
    const res = await get(`/user/info/${id}`)
    if (res) {
      // 更新本地存储的用户信息，合并现有信息和新获取的信息
      const currentUserInfo = Taro.getStorageSync('userInfo') || {}
      const newUserInfo = {
        ...currentUserInfo,
        ...res
      }
      Taro.setStorageSync('userInfo', newUserInfo)
      return { success: true, data: newUserInfo }
    }
    return { success: false, error: res }
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

// 获取用户访问过的游记ID
export const getUserHistory = async (): Promise<{ success: boolean; data?: any[]; error?: any }> => {
  try {
    const res = await get('/user-history/detailed', { redirectOnAuth: true });
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error };
  }
};

// 获取用户收藏
export const getUserFavorites = async (): Promise<{ success: boolean; data?: any[]; error?: any }> => {
  try {
    const res = await get('/user-favorites/detailed');
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error };
  }
};


export const addUserHistory = async (recordId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(recordId);
    await post('/user-history', { data: { recordId } });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}


// 切换收藏状态
export const toggleFavorite = async (postId: string): Promise<{ success: boolean; error?: any }> => {
  try {
    await post('/user-favorites/toggle', { data: { postId } });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

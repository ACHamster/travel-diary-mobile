import {View, Text, Image} from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { updateLocalUserInfo } from '../../api/user'
import type { UserInfo } from '../../api/auth'
import TabBar from '../../components/TabBar'
import settingIcon from '../../icons/settings.png'
import articleIcon from '../../icons/article.png'
import historyIcon from '../../icons/history.png'

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)

  // 使用 useDidShow 替代 useLoad，这样每次页面显示时都会检查用户信息
  useDidShow(() => {
    loadUserInfo()
  })

  const loadUserInfo = async () => {
    try {
      setLoading(true)
      const storedUserInfo = Taro.getStorageSync('userInfo')

      if (storedUserInfo) {
        // 先设置已存储的用户信息
        setUserInfo(storedUserInfo)
        // 然后尝试更新用户信息
        const { success, data } = await updateLocalUserInfo()
        if (success && data) {
          setUserInfo(data)
        }
      } else {
        setUserInfo(null)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      setUserInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    if (!userInfo) {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
    }
  }

  // 导航到我的游记页面
  const navigateToMyPosts = () => {
    Taro.navigateTo({ url: '/pages/my-posts/index' })
  }

  const navigateToMyHistory = () => {
    Taro.navigateTo({ url: '/pages/my-history/index' })
  }

  return (
    <View className='profile min-h-screen pb-16 bg-gray-50'>
      {/* 顶部内容区 */}
      <View className='bg-white p-4 mb-3'>
        <Text className='text-xl font-bold'>我的</Text>
      </View>

      {/* 用户信息区 */}
      <View className='bg-white p-6' onClick={handleLogin}>
        <View className='flex items-center'>
          <View className='w-16 h-16 rounded-full bg-gray-200 overflow-hidden'>
            {loading ? (
              <View className='w-full h-full flex items-center justify-center text-gray-400'>
                ...
              </View>
            ) : userInfo?.avatar ? (
              <View
                className='w-full h-full bg-center bg-cover'
                style={{ backgroundImage: `url(${userInfo.avatar})` }}
              />
            ) : (
              <View className='w-full h-full flex items-center justify-center text-2xl bg-blue-500 text-white'>
                {userInfo ? userInfo.username.charAt(0).toUpperCase() : '?'}
              </View>
            )}
          </View>
          <View className='ml-4'>
            {loading ? (
              <View className='text-lg'>加载中...</View>
            ) : userInfo ? (
              <>
                <View className='text-lg font-bold'>{userInfo.username}</View>
                <View className='text-gray-500 text-sm mt-1'>{userInfo.email}</View>
              </>
            ) : (
              <>
                <View className='text-lg font-bold'>点击登录</View>
                <View className='text-gray-500 text-sm mt-1'>登录后查看更多信息</View>
              </>
            )}
          </View>
        </View>
      </View>

      {/* 功能列表 */}
      <View className='mt-4 bg-white'>
        <View
          className='flex items-center p-4 active:bg-gray-50'
          onClick={navigateToMyPosts}
        >
          <Image src={articleIcon} className='w-5 h-5 mr-2' />
          <View className='flex-1'>
            <Text className='text-base'>我的游记</Text>
          </View>
          <Text className='text-gray-400'>❯</Text>
        </View>
        <View
          className='flex items-center p-4 active:bg-gray-50'
          onClick={navigateToMyHistory}
        >
          <Image src={historyIcon} className='w-5 h-5 mr-2' />
          <View className='flex-1'>
            <Text className='text-base'>浏览历史</Text>
          </View>
          <Text className='text-gray-400'>❯</Text>
        </View>
        <View className='p-4 flex justify-between items-center'>
          <View className='flex items-center'>
            <Image src={settingIcon} className='w-5 h-5' />
            <View>设置</View>
          </View>
          <View className='text-gray-400'>❯</View>
        </View>
      </View>

      <TabBar current='profile' />
    </View>
  )
}

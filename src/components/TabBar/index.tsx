import { View } from '@tarojs/components'
import { switchTab, navigateTo, getStorageSync } from '@tarojs/taro'

interface TabBarProps {
  current: 'home' | 'profile'
}

export default function TabBar({ current }: TabBarProps) {
  const handleNavigate = (page: string) => {
    if (page === current) return
    switchTab({
      url: page === 'home' ? '/pages/index/index' : '/pages/profile/index'
    })
  }

  const handlePublish = () => {
    const token = getStorageSync('token')
    if (!token) {
      navigateTo({ url: '/pages/login/index' })
      return
    }
    navigateTo({ url: '/pages/post-edit/index' })
  }

  return (
    <View className='fixed bottom-0 left-0 right-0 flex justify-between items-center bg-white h-16 px-8 shadow-lg'>
      <View 
        className={`flex flex-col items-center ${current === 'home' ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() => handleNavigate('home')}
      >
        <View className='text-xl mb-1'>🏠</View>
        <View className='text-sm'>首页</View>
      </View>
      <View 
        className='bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl shadow-md cursor-pointer hover:bg-blue-600'
        onClick={handlePublish}
      >
        +
      </View>
      <View 
        className={`flex flex-col items-center ${current === 'profile' ? 'text-blue-500' : 'text-gray-500'}`}
        onClick={() => handleNavigate('profile')}
      >
        <View className='text-xl mb-1'>👤</View>
        <View className='text-sm'>我的</View>
      </View>
    </View>
  )
}
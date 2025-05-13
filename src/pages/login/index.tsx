import { View, Text, Input, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { login } from '../../api/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username || !password) {
      await Taro.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      })
      return
    }

    setLoading(true)
    try {
      const res = await login({ username, password });
      const { success, error } = res;
      if (success) {
        Taro.showToast({
          title: '登录成功',
          icon: 'success'
        })
        // 使用switchTab而不是navigateTo，因为profile是tab页面
        Taro.switchTab({
          url: '/pages/profile/index'
        })
      } else {
        Taro.showToast({
          title: error?.message || '登录失败',
          icon: 'error'
        })
      }
    } catch (error) {
      Taro.showToast({
        title: '登录失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className='min-h-screen bg-gray-50 px-4 py-8'>
      <View className='mx-auto max-w-md'>
        <View className='text-center mb-8'>
          <Text className='text-2xl font-bold text-gray-900'>欢迎回来</Text>
          <Text className='mt-2 text-sm text-gray-600 block'>请登录您的账号</Text>
        </View>

        <View className='bg-white p-6 rounded-lg shadow-sm space-y-4'>
          <View className='space-y-2'>
            <Text className='text-sm font-medium text-gray-700 block'>用户名</Text>
            <Input
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='请输入用户名'
              value={username}
              onInput={e => setUsername(e.detail.value)}
            />
          </View>

          <View className='space-y-2'>
            <Text className='text-sm font-medium text-gray-700 block'>密码</Text>
            <Input
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='请输入密码'
              password
              value={password}
              onInput={e => setPassword(e.detail.value)}
            />
          </View>

          <Button
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>

          <View className='text-center mt-4'>
            <Text className='text-sm text-gray-600'>
              还没有账号？
              <Text
                className='text-blue-500 hover:text-blue-600'
                onClick={() => Taro.navigateTo({ url: '/pages/register/index' })}
              >
                立即注册
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

import { View, Text, Image, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';

export default function Settings() {

  const handleLogout = () => {
    Taro.clearStorageSync();
    Taro.redirectTo({ url: '/pages/login/index' });
  };

  return (
    <View className='settings min-h-screen bg-gray-50 p-4'>
      <View className='bg-white p-4 rounded shadow'>
        <Text className='text-lg font-bold mb-4'>设置</Text>
      </View>

      <Button className='w-full bg-red-500 text-white py-2 rounded mt-4' onClick={handleLogout}>退出登录</Button>
    </View>
  );
}

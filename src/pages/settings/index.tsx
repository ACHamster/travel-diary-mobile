import { View, Text, Image, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';

export default function Settings() {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleAvatarChange = () => {
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        setAvatar(res.tempFilePaths[0]);
      },
    });
  };

  const handleSave = () => {
    // 保存用户信息逻辑
    Taro.setStorageSync('userInfo', { username, avatar });
    Taro.showToast({ title: '保存成功', icon: 'success' });
  };

  const handleLogout = () => {
    Taro.clearStorageSync();
    Taro.redirectTo({ url: '/pages/login/index' });
  };

  return (
    <View className='settings min-h-screen bg-gray-50 p-4'>
      <View className='bg-white p-4 rounded shadow'>
        <Text className='text-lg font-bold mb-4'>设置</Text>

        <View className='mb-4'>
          <Text className='block text-sm text-gray-600 mb-2'>头像</Text>
          <View className='flex items-center'>
            <Image
              src={avatar || 'https://via.placeholder.com/100'}
              className='w-16 h-16 rounded-full bg-gray-200 mr-4'
            />
            <Button className='text-blue-500' onClick={handleAvatarChange}>更换头像</Button>
          </View>
        </View>

        <View className='mb-4'>
          <Text className='block text-sm text-gray-600 mb-2'>用户名</Text>
          <Input
            className='w-full p-2 border rounded'
            placeholder='请输入用户名'
            value={username}
            onInput={(e) => setUsername(e.detail.value)}
          />
        </View>

        <Button className='w-full bg-blue-500 text-white py-2 rounded' onClick={handleSave}>保存</Button>
      </View>

      <Button className='w-full bg-red-500 text-white py-2 rounded mt-4' onClick={handleLogout}>退出登录</Button>
    </View>
  );
}

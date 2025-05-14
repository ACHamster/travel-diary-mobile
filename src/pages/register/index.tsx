import { View, Text, Input, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import {signUp} from "../../api/auth";
import {BASE_URL} from "../../config";

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('https://img.achamster.live/travel%2FTransparent_Akkarin.jpg');

  const handleAvatarChange = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 1, // 只选一张作为头像
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });

      // 上传图片
      const uploadRes = await Taro.uploadFile({
        url: `${BASE_URL}/storage/upload`,
        filePath: res.tempFilePaths[0],
        name: 'file',
      });

      // 解析返回的数据，获取CDN地址
      const cdnUrl = JSON.parse(uploadRes.data).cdnUrl;

      // 更新头像状态
      setAvatar(cdnUrl);

    } catch (error) {
      console.error('上传头像失败:', error);
      Taro.showToast({
        title: '上传头像失败',
        icon: 'none'
      });
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Taro.showToast({ title: '两次密码输入不一致', icon: 'none' });
      return;
    }

    try {
      const response = await signUp({
        email,
        username,
        password,
        avatar,  // 添加头像
        userGroup: 'register',
      });

      if (response.success) {
        Taro.showToast({ title: '注册成功', icon: 'success' });
        Taro.redirectTo({ url: '/pages/login/index' });
      } else {
        // 显示具体的错误信息
        Taro.showToast({
          title: response.error?.message || '注册失败',
          icon: 'none'
        });
      }
    } catch (error: any) {
      // 显示具体的错误信息
      Taro.showToast({
        title: error?.message || '注册失败',
        icon: 'none'
      });
      console.error('注册失败:', error);
    }
  };

  return (
    <View className='register min-h-screen bg-gray-50 p-4'>
      <View className='bg-white p-4 rounded shadow'>
        <Text className='text-lg font-bold mb-4'>注册</Text>

        <View className='mb-4'>
          <Text className='block text-sm text-gray-600 mb-2'>邮箱</Text>
          <Input
            className='w-full p-2 border rounded'
            placeholder='请输入邮箱'
            value={email}
            onInput={(e) => setEmail(e.detail.value)}
          />
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

        <View className='mb-4'>
          <Text className='block text-sm text-gray-600 mb-2'>密码</Text>
          <Input
            className='w-full p-2 border rounded'
            type='text'
            password
            placeholder='请输入密码'
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
        </View>

        <View className='mb-4'>
          <Text className='block text-sm text-gray-600 mb-2'>确认密码</Text>
          <Input
            className='w-full p-2 border rounded'
            type='text'
            placeholder='请再次输入密码'
            password
            value={confirmPassword}
            onInput={(e) => setConfirmPassword(e.detail.value)}
          />
        </View>

        <View className='mb-4'>
          <Text className='block text-sm text-gray-600 mb-2'>头像</Text>
          <View className='flex items-center'>
            <Image
              src={avatar || 'https://img.achamster.live/travel%2FTransparent_Akkarin.jpg'}
              className='w-16 h-16 rounded-full bg-gray-200 mr-4'
            />
            <Button className='text-blue-500' onClick={handleAvatarChange}>上传头像</Button>
          </View>
        </View>

        <Button className='w-full bg-blue-500 text-white py-2 rounded' onClick={handleRegister}>注册</Button>
      </View>
    </View>
  );
}

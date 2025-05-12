import { View, Text, Input, Textarea, Button, Image, Video } from '@tarojs/components'
import { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { BASE_URL } from '../../config';
import { createPost } from '../../api/posts'
import { get } from "../../api/request";
import {Lines, mergeLines, NoLine, PendingLine, removeLine, VideoLine} from "../../lib/quick-tag";


interface FormData {
  id?: string;
  title: string;
  content: string;
  images: string[];
  video?: string;
  coverImage?: string;
  quickTag: Lines;
}

interface PostResponse {
  quickTag: Lines;
  success: boolean;
  title: string;
  content: string;
  images: string[];
  video?: string;
  coverImage?: string;
}

export default function PostEdit() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    images: [],
    quickTag: NoLine,
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)




  // 检查登录状态
  useLoad(() => {
    const token = Taro.getStorageSync('token')
    if (!token) {
      Taro.showToast({
        title: '请先登录',
        icon: 'none'
      })
      Taro.navigateTo({ url: '/pages/login/index' })
    }
  })


  useLoad(async (options) => {
    if (options.id) {
      try {
        const res = (await get(`/posts/${options.id}`)) as unknown as PostResponse;
        if (res) {
          setFormData({
            id: options.id,
            title: res.title || '',
            content: res.content || '',
            images: res.images || [],
            video: res.video || undefined,
            coverImage: res.coverImage || undefined, // 如果需要封面图
            quickTag: res.quickTag,
          });
        }else {
          Taro.showToast({ title: '加载失败', icon: 'none' })
        }
      } catch (error) {
        console.error('加载游记失败:', error)
        Taro.showToast({ title: '加载失败', icon: 'none' })
      }
    }
  })
  // 计算文件的 SHA1 哈希值


  // const calculateFileSha1 = async (filePath: string): Promise<string> => {
  //   try {
  //     const fileContent = await Taro.getFileSystemManager().readFileSync(filePath, 'binary');
  //     const wordArray = CryptoJS.lib.WordArray.create(fileContent);
  //     const hash = CryptoJS.SHA1(wordArray).toString();
  //     console.log('File SHA1:', hash);
  //     return hash;
  //   } catch (error) {
  //     throw new Error('计算文件哈希值失败');
  //   }
  // };

  // 表单验证
  const validate = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.title.trim()) {
      newErrors.title = '请输入标题'
    }
    if (!formData.content.trim()) {
      newErrors.content = '请输入内容'
    }
    if (formData.images.length === 0 && !formData.video) {
      newErrors.images = '请至少上传一张图片或者一个视频'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 选择图片
  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9 - formData.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      const uploadedImages = await Promise.all(
        res.tempFilePaths.map(async (path) => {
          const uploadRes = await Taro.uploadFile({
            url: `${BASE_URL}/storage/upload`,
            filePath: path,
            name: 'file',
          })
          return JSON.parse(uploadRes.data).cdnUrl
        })
      )

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }))
    } catch (error) {
      console.error('Upload image error:', error)
      Taro.showToast({
        title: '图片上传失败',
        icon: 'none'
      })
    }
  }

  // 选择视频
  const handleChooseVideo = async () => {
    try {
      const res = await Taro.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        compressed: true
      })

      const uploadRes = await Taro.uploadFile({
        url: `${BASE_URL}/storage/upload`,
        filePath: res.tempFilePath,
        name: 'file'
      })

      const videoUrl = JSON.parse(uploadRes.data).video.cdnUrl;
      const videoCoverUrl = JSON.parse(uploadRes.data).thumbnail.cdnUrl;
      console.log(videoCoverUrl)
      setFormData(prev => ({
        ...prev,
        video: videoUrl,
        coverImage: videoCoverUrl,
        quickTag: mergeLines(formData.quickTag, VideoLine),
      }))
    } catch (error) {
      console.error('Upload video error:', error)
      Taro.showToast({
        title: '视频上传失败',
        icon: 'none'
      })
    }
  }

  // 删除图片
  const handleDeleteImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // 删除视频
  const handleDeleteVideo = () => {
    setFormData(prev => ({
      ...prev,
      video: undefined,
      quickTag: removeLine(formData.quickTag, VideoLine),
    }))
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!validate()) {
      const firstError = Object.values(errors)[0]
      Taro.showToast({
        title: firstError,
        icon: 'none'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createPost({
        id: formData.id,
        title: formData.title,
        content: formData.content,
        coverImage: formData.coverImage || formData.images[0],
        images: formData.images,
        video: formData.video,
        quickTag: mergeLines(formData.quickTag, PendingLine),
      })

      if (res.success) {
        Taro.showToast({
          title: '发布成功',
          icon: 'success'
        })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        throw new Error('发布失败')
      }
    } catch (error) {
      Taro.showToast({
        title: '发布失败，请重试',
        icon: 'none'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className='post-edit px-4 py-6 min-h-screen bg-white'>
      {/* 标题输入 */}
      <View className='mb-4'>
        <Text className='block mb-2 text-gray-700'>标题</Text>
        <Input
          className='w-full p-2 border rounded'
          placeholder='请输入标题'
          value={formData.title}
          onInput={e => setFormData(prev => ({ ...prev, title: e.detail.value }))}
        />
        {errors.title && <Text className='text-red-500 text-sm mt-1'>{errors.title}</Text>}
      </View>

      {/* 内容输入 */}
      <View className='mb-4'>
        <Text className='block mb-2 text-gray-700'>内容</Text>
        <Textarea
          className='w-full p-2 border rounded min-h-[200px]'
          placeholder='请输入游记内容'
          value={formData.content}
          onInput={e => setFormData(prev => ({ ...prev, content: e.detail.value }))}
        />
        {errors.content && <Text className='text-red-500 text-sm mt-1'>{errors.content}</Text>}
      </View>

      {/* 图片上传 */}
      <View className='mb-4'>
        <Text className='block mb-2 text-gray-700'>图片</Text>
        <View className='grid grid-cols-3 gap-2'>
          {formData.images.map((image, index) => (
            <View key={image} className='relative'>
              <Image
                src={image}
                className='w-full h-24 object-cover rounded'
                mode='aspectFill'
              />
              <View
                className='absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                onClick={() => handleDeleteImage(index)}
              >
                ×
              </View>
            </View>
          ))}
          {formData.images.length < 9 && (
            <View
              className='w-full h-24 border-2 border-dashed rounded flex items-center justify-center'
              onClick={handleChooseImage}
            >
              <Text className='text-gray-500'>+</Text>
            </View>
          )}
        </View>
        {errors.images && <Text className='text-red-500 text-sm mt-1'>{errors.images}</Text>}
      </View>

      {/* 视频上传 */}
      <View className='mb-6'>
        <Text className='block mb-2 text-gray-700'>视频（可选）</Text>
        {formData.video ? (
          <View className='relative'>
            <Video
              src={formData.video}
              className='w-full rounded'
              showProgress={false}
              initialTime={0}
              controls
              autoplay={false}
              loop={false}
              muted={false}
            />
            <View
              className='absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
              onClick={handleDeleteVideo}
            >
              ×
            </View>
          </View>
        ) : (
          <View
            className='w-full h-32 border-2 border-dashed rounded flex items-center justify-center'
            onClick={handleChooseVideo}
          >
            <Text className='text-gray-500'>点击上传视频</Text>
          </View>
        )}
      </View>

      {/* 提交按钮 */}
      <Button
        className='w-full bg-blue-500 text-white rounded-full py-2'
        onClick={handleSubmit}
        loading={isSubmitting}
      >
        发布游记
      </Button>
    </View>
  )
}

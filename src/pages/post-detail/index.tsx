import { useState } from 'react'
import { View, Text, Image, Swiper, SwiperItem, Video } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { get } from '../../api/request'
import './index.css'
import {addUserHistory} from "../../api/user";

interface Author {
  id: number
  username: string
}

interface Post {
  id: string
  title: string
  date: string
  content: string
  description: string | null
  images: string[]
  video: string
  auditStatus: string
  rejectReason: string | null
  author: Author
}

export default function PostDetail() {
  const [post, setPost] = useState<Post | null>(null)

  useLoad(async (options) => {
    if (options.id) {
      try {
        const res = await get(`/posts/${options.id}`);
        await addUserHistory(options.id);
        setPost(res as unknown as Post);
      } catch (error) {
        console.error('Failed to fetch post:', error)
      }
    }
  })

  if (!post) {
    return <View className='loading'>加载中...</View>
  }

  return (
    <View className='post-detail'>
      <View className='w-full flex items-center'>
        <Image src={post.author.avatar} className='w-6 h-6 rounded-full' />
        <View className='font-xl ml-4'>{post.author.username}</View>
      </View>
      {/* 图片轮播，视频作为第一个 */}
      {(post.video || (post.images && post.images.length > 0)) && (
        <Swiper
          className='post-images max-h-[80vh]'
          indicatorDots
          circular
          autoplay={false}
          indicatorColor='#999'
          indicatorActiveColor='#333'
        >
          {post.video && (
            <SwiperItem className='flex items-center'>
              <Video
                src={post.video}
                controls
                showFullscreenBtn
                autoplay={false}
                className='w-full rounded'
              />
            </SwiperItem>
          )}
          {post.images.map((image, index) => (
            <SwiperItem key={index} className='flex items-center'>
              <Image
                mode='aspectFill'
                className='post-image'
                src={image}
              />
            </SwiperItem>
          ))}
        </Swiper>
      )}

      {/* 作者信息 */}


      {/* 标题和内容 */}
      <View className='post-content'>
        <Text className='post-title'>{post.title}</Text>
        <Text className='post-text'>{post.content}</Text>
      </View>
      <View className='post-date px-2'>
        {new Date(post.date).toLocaleDateString('zh-CN')}
      </View>
    </View>
  )
}

import { useState } from 'react'
import { View, Text, Image, Swiper, SwiperItem, Video } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { get } from '../../api/request'
import './index.css'

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
        const res = await get(`/posts/${options.id}`)
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
      {post.video && (
        <View className='post-video'>
          <Video
            src={post.video}
            controls
            autoplay={false}
            className='w-full rounded'
          />
        </View>
      )}
      {/* 图片轮播 */}
      {post.images && post.images.length > 0 && (
        <Swiper
          className='post-images'
          indicatorDots
          circular
          autoplay={false}
          indicatorColor='#999'
          indicatorActiveColor='#333'
        >
          {post.images.map((image, index) => (
            <SwiperItem key={index}>
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
      <View className='author-info'>
        <View className='author-name'>{post.author.username}</View>
        <View className='post-date'>
          {new Date(post.date).toLocaleDateString('zh-CN')}
        </View>
      </View>

      {/* 标题和内容 */}
      <View className='post-content'>
        <Text className='post-title'>{post.title}</Text>
        <Text className='post-text'>{post.content}</Text>
      </View>
    </View>
  )
}

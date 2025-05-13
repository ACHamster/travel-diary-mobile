import { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Video } from '@tarojs/components'
import { get } from '../../api/request'
import './index.css'
import {addUserHistory, toggleFavorite} from "../../api/user";
import favoriteIcon from '../../icons/favorite.png';
import favoritedIcon from '../../icons/favorited.png';
import shareIcon from '../../icons/share.png';

interface Author {
  id: number;
  username: string;
  avatar: string;
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
  isFavorited?: boolean
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

  const handleFavoriteToggle = async () => {
    if (post) {
      try {
        await toggleFavorite(post.id);
        setPost({ ...post, isFavorited: !post.isFavorited });
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
      }
    }
  };

  const handleShare = () => {
    if (post) {
      Taro.showShareMenu({
        withShareTicket: true,
      });
    }
  };

  if (!post) {
    return <View className='loading'>加载中...</View>
  }

  return (
    <View className='post-detail flex flex-col min-h-screen'>
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
      <View className='post-content flex-1 px-4 py-2'>
        <Text className='post-title text-xl font-bold mb-2'>{post.title}</Text>
        <Text className='post-text text-base leading-relaxed'>{post.content}</Text>
      </View>
      <View className='post-date text-sm text-gray-500 px-4 mb-4'>
        {new Date(post.date).toLocaleDateString('zh-CN')}
      </View>

      <View className='bottom-bar fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around items-center py-2'>
        <Image
          src={post.isFavorited ? favoritedIcon : favoriteIcon}
          className='icon w-6 h-6'
          onClick={handleFavoriteToggle}
        />
        <Image
          src={shareIcon}
          className='icon w-6 h-6'
          onClick={handleShare}
        />
      </View>
    </View>
  )
}

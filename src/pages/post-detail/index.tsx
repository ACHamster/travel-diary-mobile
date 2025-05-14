import { useState } from 'react'
import Taro, { useLoad } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Video } from '@tarojs/components'
import { get } from '../../api/request'
import './index.css'
import {addUserHistory, toggleFavorite} from "../../api/user";
import favoriteIcon from '../../icons/favorite.png';
import favoritedIcon from '../../icons/favorited.png';
import shareIcon from '../../icons/share.png';
import locationIcon from '../../icons/pin_drop.png';

interface Author {
  id: number;
  username: string;
  avatar: string;
}

interface Location {
  province: string
  city: string
}

interface Post {
  id: string
  title: string
  date: string
  content: string
  description: string | null
  images: string[]
  video: string
  location?: string // 实际存储的是 Location 的 JSON 字符串
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

  const handleImageClick = (currentImage: string) => {
    // 预览图片，传入当前点击的图片和所有图片数组
    Taro.previewImage({
      current: currentImage, // 当前显示图片的链接
      urls: post?.images || [], // 需要预览的图片链接列表
    });
  };

  const parseLocation = (locationStr?: string): Location | null => {
    if (!locationStr) return null;
    try {
      return JSON.parse(locationStr) as Location;
    } catch {
      return null;
    }
  }

  const formatLocation = (location: Location): string => {
    if (location.province === location.city) {
      return location.city;
    }
    return `${location.province} ${location.city}`;
  }

  if (!post) {
    return <View className='loading'>加载中...</View>
  }

  return (
    <View className='flex flex-col min-h-screen bg-white'>
      {/* 图片/视频展示区域 */}
      {(post.video || (post.images && post.images.length > 0)) && (
        <View className='w-full h-[75vh]'>
          <Swiper
            className='w-full h-full'
            indicatorDots
            circular
            autoplay={false}
            indicatorColor='#999'
            indicatorActiveColor='#333'
          >
            {post.video && (
              <SwiperItem>
                <Video
                  src={post.video}
                  controls
                  showFullscreenBtn
                  autoplay={false}
                  className='w-full h-full object-cover'
                />
              </SwiperItem>
            )}
            {post.images.map((image, index) => (
              <SwiperItem key={index} className='w-full h-full flex items-center justify-center'>
                <Image
                  mode='aspectFill'
                  className='w-full h-full'
                  src={image}
                  onClick={() => handleImageClick(image)}
                />
              </SwiperItem>
            ))}
          </Swiper>
        </View>
      )}

      {/* 内容区域 */}
      <View className='flex-1 px-4 pt-4'>
        <View className='flex items-center mb-4'>
          <Image src={post.author.avatar} className='w-8 h-8 rounded-full' />
          <Text className='ml-2 font-semibold'>{post.author.username}</Text>
        </View>

        {parseLocation(post.location) && (
          <View className='inline-flex items-center bg-gray-100 rounded-full px-3 py-1 mb-3'>
            <Image src={locationIcon} className='w-4 h-4 mr-1' />
            <Text className='text-sm text-gray-600'>
              {formatLocation(parseLocation(post.location)!)}
            </Text>
          </View>
        )}

        <View className='mb-4'>
          <Text className='text-xl font-bold'>{post.title}</Text>
        </View>

        <View className='mb-4 text-base leading-relaxed text-gray-700'>
          <Text>{post.content}</Text>
        </View>

        <View className='text-sm text-gray-500 mb-16'>
          {new Date(post.date).toLocaleDateString('zh-CN')}
        </View>
      </View>

      {/* 底部操作栏 */}
      <View className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-3 px-4'>
        <Image
          src={post.isFavorited ? favoritedIcon : favoriteIcon}
          className='w-6 h-6'
          onClick={handleFavoriteToggle}
        />
        <Image
          src={shareIcon}
          className='w-6 h-6'
          onClick={handleShare}
        />
      </View>
    </View>
  )
}


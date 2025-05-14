import {View, Image, Text, Icon} from '@tarojs/components'
import Taro from '@tarojs/taro'
import camIcon from '../../icons/videocam.png'
import {includeSomeLine, Lines, VideoLine} from "../../lib/quick-tag";

interface PostCardProps {
  post: {
    quickTag: Lines
    id: string
    title: string
    date: string
    images: string[]
    viewCount: number
    coverImage?: string
    author: {
      avatar: string
      username: string
    }
  }
}

export default function PostCard({ post }: PostCardProps) {
  // 格式化日期为 YYYY-MM-DD 格式
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handlePostClick = () => {
    Taro.navigateTo({
      url: `/pages/post-detail/index?id=${post.id}`
    })
  }

  return (
    <View className='w-full mb-2 bg-white flex flex-col' onClick={handlePostClick}>
      {/* 游记封面图 */}
      <View className='relative'>
        <Image
          src={post.coverImage || post.images[0]}
          className='w-full aspect-square rounded-t-lg object-cover'
          mode='aspectFill'
        />
        {includeSomeLine(post.quickTag, VideoLine) && (
          <Image
            src={camIcon}
            className='absolute top-2 right-2 w-5 h-5'
            mode='aspectFit'
          />
        )}
      </View>

      {/* 标题区域 - 固定高度确保两行 */}
      <View className='px-2 py-2'>
        <Text className='text-sm font-medium line-clamp-2 min-h-[2.5em]'>{post.title}</Text>
      </View>

      {/* 作者信息与浏览量区域 - 固定在底部 */}
      <View className='mt-auto px-2 py-2 border-t border-gray-100'>
        <View className='flex items-center'>
          <Image
            src={post.author.avatar}
            className='w-6 h-6 rounded-full mr-2'
            mode='aspectFill'
          />
          <View className='flex flex-col justify-center'>
            <Text className='text-xs text-gray-500'>{post.author.username}</Text>
            <Text className='text-xs text-gray-400'>{formatDate(post.date)}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}


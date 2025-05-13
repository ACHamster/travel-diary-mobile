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
    <View className='w-full mb-4 bg-white' onClick={handlePostClick}>
      {/* 游记封面图 */}
      <View className='relative'>
        <Image
          src={post.coverImage || post.images[0]}
          className='w-full aspect-square rounded-t-lg object-cover mb-2'
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

      {/* 标题区域 */}
      <View className='px-1 mb-2'>
        <Text className='text-sm font-medium line-clamp-2'>{post.title}</Text>
      </View>

      {/* 作者信息与浏览量区域 */}
      <View className='px-1 flex justify-between items-center'>
        {/* 左侧：作者头像和信息（两行显示） */}
        <View className='flex items-center'>
          {/* 作者头像 */}
          <Image
            src={post.author.avatar}
            className='w-6 h-6 rounded-full mr-2'
            mode='aspectFill'
          />

          {/* 作者名和日期（垂直排列） */}
          <View className='flex flex-col justify-center'>
            <Text className='text-sm font-medium'>{post.author.username}</Text>
            <Text className='text-xs text-gray-400'>{formatDate(post.date)}</Text>
          </View>
        </View>

        {/* 右侧：浏览量 */}
        <View className='flex flex-col items-center'>
          <Icon type='search' size={10} />
          <Text className='text-xs text-gray-400 mt-0.5'>{post.viewCount}</Text>
        </View>
      </View>
    </View>
  )
}

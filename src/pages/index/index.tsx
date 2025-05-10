import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import TabBar from '../../components/TabBar'
import PostCard from '../../components/PostCard'
import { fetchApprovedPosts } from '../../api/posts'
import './index.css'

interface Post {
  id: string
  title: string
  images: string[]
  viewCount: number
}

export default function Index () {
  const [posts, setPosts] = useState<Post[]>([])

  useLoad(async () => {
    const res = await fetchApprovedPosts()
    if (res.success && res.data) {
      setPosts(res.data)
    }
  })

  return (
    <View className='index min-h-screen pb-16'>
      {/*搜索栏*/}
      <View className='p-4'>
        <View className='bg-gray-100 rounded-full px-4 py-2 text-gray-500'>
          搜索目的地、游记...
        </View>
      </View>

      {/*游记列表*/}
      <View className='p-4 bg-gray-100 min-h-screen'>
        <View className='grid grid-cols-2 gap-2'>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </View>

      <TabBar current='home' />
    </View>
  )
}

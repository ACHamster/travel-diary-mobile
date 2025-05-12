import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
// import Taro from '@tarojs/taro'
import { useState } from 'react'
import { fetchMyPosts, deletePost } from '../../api/posts'
import TabBar from '../../components/TabBar'
import MyPostCard from '../../components/MyPostCard'
import {Lines} from "../../lib/quick-tag";

interface Post {
  id: string
  title: string
  date: string
  images: string[]
  quickTag: Lines
  auditStatus: 'pending' | 'approved' | 'rejected'
  rejectReason?: string | null
  viewCount: number
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  // 加载我的游记列表
  const loadMyPosts = async () => {
    setLoading(true)
    try {
      const res = await fetchMyPosts();
      if (res.success && res.data) {
        setPosts(res.data)
      } else {
        Taro.showToast({ title: '加载失败', icon: 'none' })
      }
    } catch (error) {
      console.error('加载游记失败:', error)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时获取数据
  useLoad(() => {
    loadMyPosts()
  })

  // 处理删除游记
  const handleDelete = async (id: string) => {
    Taro.showModal({
      title: '提示',
      content: '确定要删除这篇游记吗？',
      success: async (res) => {
        if (res.confirm) {
          const response = await deletePost(id)
          if (response.success) {
            Taro.showToast({ title: '删除成功', icon: 'success' })
            // 重新加载列表
            loadMyPosts()
          } else {
            Taro.showToast({ title: '删除失败', icon: 'error' })
          }
        }
      }
    })
  }

  // 处理编辑游记
  const handleEdit = (id: string) => {
    Taro.navigateTo({ url: `/pages/post-edit/index?id=${id}` })
  }

  return (
    <View className='min-h-screen pb-16 bg-gray-50'>
      {/* 顶部标题 */}
      <View className='bg-white p-4 mb-3'>
        <Text className='text-xl font-bold'>我的游记</Text>
      </View>

      {/* 内容区域 */}
      <View className='px-4'>
        {loading ? (
          <View className='py-10 text-center text-gray-500'>加载中...</View>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <MyPostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onEdit={() => handleEdit(post.id)}
            />
          ))
        ) : (
          <View className='py-10 text-center text-gray-500'>
            暂无游记，去创建一篇吧~
          </View>
        )}
      </View>

      <TabBar current='profile' />
    </View>
  )
}

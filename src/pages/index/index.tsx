import { View, Input, Image } from '@tarojs/components'
import Taro, { useLoad, usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import { useState } from 'react'
import TabBar from '../../components/TabBar'
import PostCard from '../../components/PostCard'
import { fetchApprovedPosts, searchPosts } from '../../api/posts'
import chevronLeftIcon from '../../icons/chevron_left.png'
import searchIcon from '../../icons/search.png'
import './index.css'

interface Post {
  id: string;
  title: string;
  images: string[];
  viewCount: number;
  quickTag: number;
  date: string;
  coverImage?: string;
  author: {
    avatar: string;
    username: string;
  };
}

export default function Index () {
  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [nowPage, setNowPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const loadPosts = async (page: number, isRefresh: boolean = false) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const res = await fetchApprovedPosts({ page, limit: 6 }) // 增加 limit 参数
      console.log(res.data.items);
      if (res.success && res.data) {
        setPosts(prev => isRefresh ? res.data.items : [...prev, ...res.data.items])
        setHasMore(res.data.hasMore)
        setNowPage(res.data.page)
      }
    } catch (error) {
      console.error('加载失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return;
    setIsLoading(true);
    try {
      const res = await searchPosts(searchKeyword);
      // 添加调试日志以检查搜索结果
      console.log('搜索结果:', res.data.items);
      // 确保搜索结果替换首页内容
      if (res.success && res.data) {
        setPosts(res.data.items || []); // 确保 posts 被正确更新
        setHasMore(false); // 搜索结果不需要分页
      } else {
        setPosts([]); // 如果没有数据，清空 posts
      }
    } catch (error) {
      console.error('搜索失败:', error);
      Taro.showToast({
        title: '搜索失败',
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useLoad(() => {
    loadPosts(1, true)
  })

  usePullDownRefresh(async () => {
    await loadPosts(1, true)
    Taro.stopPullDownRefresh()
  })

  useReachBottom(() => {
    if (hasMore && !isLoading) {
      loadPosts(nowPage + 1)
    }
  })

  return (
    <View className='index min-h-screen pb-16'>
      {/*搜索栏*/}
      <View className='p-4'>
        <View className='flex items-center'>
          {searchKeyword && (
            <View
              className='mt-2 mr-1 text-gray-500 text-xl cursor-pointer'
              onClick={() => {
                setSearchKeyword('');
                loadPosts(1, true); // 返回首页
              }}
            >
              <Image
                src={chevronLeftIcon}
                className='w-6 h-6'
              />
            </View>
          )}
          <Input
            className='flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500'
            placeholder='搜索目的地、游记...'
            value={searchKeyword}
            onInput={(e) => setSearchKeyword(e.detail.value)}
          />
          <View
            className='ml-2 text-white rounded-full'
            onClick={handleSearch}
          >
            <Image src={searchIcon} className='w-6 h-6' />
          </View>

        </View>
      </View>

      {/*游记列表*/}
      <View className='p-4 bg-gray-100 min-h-screen'>
        <View className='grid grid-cols-2 gap-2'>
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <View className='text-center text-gray-500'>暂无游记</View>
          )}
        </View>

        {/*加载状态*/}
        {isLoading && (
          <View className='text-center py-4 text-gray-500'>
            加载中...
          </View>
        )}

        {/*没有更多数据*/}
        {!hasMore && posts.length > 0 && (
          <View className='text-center py-4 text-gray-500'>
            没有更多了
          </View>
        )}
      </View>

      <TabBar current='home' />
    </View>
  )
}

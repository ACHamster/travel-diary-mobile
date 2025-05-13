import {View} from "@tarojs/components";
import { useEffect, useState } from 'react';
import { getUserHistory } from '../../api/user';
import PostCard from '../../components/PostCard';

export default function MyHistory() {
  const [historyPosts, setHistoryPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchHistory() {
      const historyRes = await getUserHistory();
      if (historyRes.success && historyRes.data) {
        setHistoryPosts(historyRes.data);
      }
    }

    fetchHistory();
  }, []);

  return (
    <View className='p-4 bg-gray-100 min-h-screen'>
      <View className='grid grid-cols-2 gap-2'>
        {historyPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </View>
    </View>
  );
}

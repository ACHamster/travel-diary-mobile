import {View} from "@tarojs/components";
import { useEffect, useState } from 'react';
import {getUserFavorites, getUserHistory} from '../../api/user';
import PostCard from '../../components/PostCard';

export default function MyHistory() {
  const [favoritePosts, setFavoritePosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFavorites() {
      const historyRes = await getUserFavorites();
      if (historyRes.success && historyRes.data) {
        setFavoritePosts(historyRes.data);
      }
    }

    fetchFavorites();
  }, []);

  return (
    <View className='p-4 bg-gray-100 min-h-screen'>
      <View className='grid grid-cols-2 gap-2'>
        {favoritePosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </View>
    </View>
  );
}

import {View, Image, Text, Video} from '@tarojs/components';
import editIcon from '../../icons/edit.png';
import deleteIcon from '../../icons/delete.png';
import {
  ApprovedLine,
  PendingLine,
  RejectedLine,
  DeletedLine,
  VideoLine,
  includeSomeLine,
} from '../../lib/quick-tag';
import videoIcon from '../../icons/videocam.png';

interface MyPostCardProps {
  post: {
    id: string;
    title: string;
    date: string;
    images: string[];
    coverImage: string;
    quickTag: number;
    rejectReason?: string | null;
    viewCount: number;
  };
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

// 审核状态对应的显示文本和样式
const statusConfig = {
  [PendingLine]: { text: '待审核', color: 'bg-yellow-100 text-yellow-600' },
  [ApprovedLine]: { text: '已通过', color: 'bg-green-100 text-green-600' },
  [RejectedLine]: { text: '未通过', color: 'bg-red-100 text-red-600' },
  [DeletedLine]: { text: '已删除', color: 'bg-gray-100 text-gray-600' },
};

export default function MyPostCard({ post, onDelete, onEdit }: MyPostCardProps) {
  // 格式化日期为 YYYY-MM-DD 格式
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 获取当前状态配置
  const currentStatus =
    Object.entries(statusConfig).find(([line]) =>
      includeSomeLine(post.quickTag, Number(line))
    )?.[1] || statusConfig[PendingLine];

  return (
    <View className='w-full mb-4 bg-white rounded-lg shadow-sm overflow-hidden'>
      <View className='relative'>
        {/* 游记封面图或视频 */}
        <Image
          src={post.coverImage}
          className='w-full aspect-[3/2] object-cover'
          mode='aspectFill'
        />
        {/* 视频标识 */}
        {includeSomeLine(post.quickTag, VideoLine) && (
          <Image
            src={videoIcon}
            className='absolute top-2 left-2 w-5 h-5'
            mode='aspectFit'
          />
        )}
        {/* 状态标签 */}
        <View className={`absolute top-2 right-2 px-2 py-1 rounded-full ${currentStatus.color} text-xs`}>
          {currentStatus.text}
        </View>
      </View>

      {/* 内容区域 */}
      <View className='p-3'>
        {/* 标题 */}
        <View className='mb-2'>
          <Text className='text-base font-medium line-clamp-2'>{post.title}</Text>
        </View>

        {/* 拒绝原因（仅在被拒绝时显示） */}
        {includeSomeLine(post.quickTag, RejectedLine) && post.rejectReason && (
          <View className='mb-3 flex items-start bg-gray-50 p-2 rounded'>
            {/*<WarningOutlined className='text-red-500 mr-1 mt-0.5 flex-shrink-0' />*/}
            <Text className='text-xs text-gray-600'>拒绝原因：{post.rejectReason}</Text>
          </View>
        )}

        {/* 底部信息和操作区 */}
        <View className='flex justify-between items-center mt-2'>
          {/* 发布日期和浏览量 */}
          <View className='flex items-center'>
            <Text className='text-xs text-gray-400'>{formatDate(post.date)}</Text>
            <View className='flex items-center ml-3'>
              <Text className='text-xs text-gray-400 ml-1'>{post.viewCount}</Text>
            </View>
          </View>

          {/* 操作按钮 */}
          <View className='flex items-center'>
            {!includeSomeLine(post.quickTag, ApprovedLine) && (
              <View
                className='mr-3 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'
                onClick={() => onEdit(post.id)}
              >
                <Image src={editIcon} className='w-4 h-4' />
              </View>
            )}
            <View
              className='mr-3 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center'
              onClick={() => onDelete(post.id)}
            >
              <Image src={deleteIcon} className='w-4 h-4' />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

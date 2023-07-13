import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config';
import replyKeys from 'features/replies/utils/replyQuerykeyFactory';
import { useAuth } from 'hooks';
import { IReply } from 'types';

async function getReplies(
  commentId: string,
  page: number,
  pageSize: number,
  sort: string,
  userToken: string
): Promise<{ replies: IReply[] }> {
  const req = await axiosConfig.get(`/comments/${commentId}/replies`, {
    params: {
      page,
      pageSize,
      sort,
    },
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return { replies: req.data.reverse() };
}

export default function useReplies(
  commentId: string,
  pageSize: number,
  sort: 'asc' | 'desc',
  repliesCount: number
) {
  const { userToken } = useAuth();
  return useInfiniteQuery({
    queryKey: replyKeys.reply(commentId),
    queryFn: ({ pageParam = 1 }) =>
      getReplies(commentId, pageParam, pageSize, sort, userToken as string),
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams],
    }),
    getNextPageParam: (_lastPage, allPages) => {
      const repliesLeft = allPages.length * pageSize - repliesCount;
      return repliesLeft < 0 ? allPages.length + 1 : undefined;
    },
  });
}

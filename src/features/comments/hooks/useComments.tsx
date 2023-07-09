import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config';
import commentKeys from 'features/comments/utils/commentQuerykeyFactory';
import { useAuth } from 'hooks';
import { IComment } from 'types';

async function getComments(
  postId: string,
  page: number,
  pageSize: number,
  sort: string,
  userToken: string
): Promise<{ comments: IComment[] }> {
  const comments = await axiosConfig.get(`/posts/${postId}/comments`, {
    params: { page, pageSize, sort },
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return { comments: comments.data.reverse() };
}

export default function useComments(
  commentsCount: number,
  pagesize: number,
  postId: string,
  sort: string
) {
  const { userToken } = useAuth();

  return useInfiniteQuery({
    queryKey: commentKeys.post(postId),
    queryFn: ({ pageParam = 1 }) =>
      getComments(postId, pageParam, pagesize, sort, userToken as string),
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams],
    }),
    getNextPageParam: (_lastPage, allPages) => {
      const commentsLeft = allPages.length * pagesize - commentsCount;
      return commentsLeft < 0 ? allPages.length + 1 : undefined;
    },
  });
}

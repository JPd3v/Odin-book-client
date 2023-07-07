import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import postKeys from 'features/posts/utils/postQuerykeyFactory';
import { useParams } from 'react-router-dom';
import { IPost } from 'types';

async function userPosts(
  userId: string,
  userToken: string,
  pageParam = 1,
  pageSize = 10
) {
  const req = await axiosConfig.get<IPost[]>(
    `/posts/${userId}/user-posts?page=${pageParam}&pageSize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );
  return { posts: req.data };
}

export default function useUserPosts() {
  const { userToken } = useAuth();
  const userId = useParams().id as string;
  return useInfiniteQuery({
    queryKey: postKeys.profile(userId),
    queryFn: ({ pageParam = 1 }) =>
      userPosts(userId, userToken as string, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.posts.length ? allPages.length + 1 : undefined,
  });
}

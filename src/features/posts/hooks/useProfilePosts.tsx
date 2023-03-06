import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { IPage } from '../types';

async function userPosts(
  userId: string,
  userToken: string,
  pageParam = 1,
  pageSize = 3
): Promise<IPage> {
  const req = await axiosConfig.get(
    `/posts/${userId}/user-posts?page=${pageParam}&pageSize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );
  return { posts: req.data };
}

export default function useUserPosts(queryKey: string, userId: string) {
  const { userToken } = useAuth();

  return useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam = 1 }) =>
      userPosts(userId, userToken ?? '', pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.posts.length ? allPages.length + 1 : undefined,
  });
}

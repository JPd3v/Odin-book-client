import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { useParams } from 'react-router-dom';

async function userPosts(
  userId: string,
  userToken: string,
  pageParam = 1,
  pageSize = 3
) {
  const req = await axiosConfig.get(
    `/posts/${userId}/user-posts?page=${pageParam}&pageSize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );
  return { posts: req.data };
}

export default function useUserPosts() {
  const { userToken } = useAuth();

  const params = useParams();
  const userId = params.id ?? '';

  return useInfiniteQuery({
    queryKey: ['user posts', userId],
    queryFn: ({ pageParam = 1 }) =>
      userPosts(userId, userToken ?? '', pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.posts.length ? allPages.length + 1 : undefined,
  });
}

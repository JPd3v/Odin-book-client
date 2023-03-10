import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';

export default function useFeed(cachekey: string) {
  const { userToken } = useAuth();
  async function getRelatedPosts(pageParam = 1, pageSize = 3) {
    const req = await axiosConfig.get(
      `/posts/user-feed?page=${pageParam}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    return { posts: req.data };
  }

  return useInfiniteQuery({
    queryKey: [cachekey],
    queryFn: ({ pageParam = 1 }) => getRelatedPosts(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.posts.length ? allPages.length + 1 : undefined,
  });
}

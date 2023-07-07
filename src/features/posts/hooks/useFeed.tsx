import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import postKeys from 'features/posts/utils/postQuerykeyFactory';
import { useAuth } from 'hooks/index';

async function getRelatedPosts(
  userToken: string,
  pageParam = 1,
  pageSize = 10
) {
  const req = await axiosConfig.get(
    `/posts/user-feed?page=${pageParam}&pageSize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );
  return { posts: req.data };
}

export default function useFeed() {
  const { userToken } = useAuth();

  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: ({ pageParam = 1 }) =>
      getRelatedPosts(userToken as string, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.posts.length ? allPages.length + 1 : undefined,
  });
}

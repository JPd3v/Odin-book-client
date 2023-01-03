import { useInfiniteQuery } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';

export default function useUserRelatedPosts() {
  const { userToken } = useAuth();
  async function getRelatedPosts(pageParam = 1, pageSize = 3) {
    const req = await axiosConfig.get(
      `/posts/user-feed?page=${pageParam}&pageSize=${pageSize}`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    return req.data;
  }

  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => getRelatedPosts(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length ? allPages.length + 1 : undefined,
  });
}
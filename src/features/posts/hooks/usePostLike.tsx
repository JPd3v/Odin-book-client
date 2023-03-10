import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { InfiniteData } from '../types';

async function likePost(postId: string, userToken: string): Promise<string[]> {
  const req = await axiosConfig.post(
    `/posts/${postId}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function usePostLike(queryKey: string | Array<string | number>) {
  const { userToken, userInfo } = useAuth();
  const queryClient = useQueryClient();

  const userId = userInfo?._id ?? '';

  return useMutation([queryKey], {
    mutationFn: (postId: string) => likePost(postId, userToken ?? ''),
    onMutate: async (postId) => {
      await queryClient.cancelQueries([queryKey]);

      const previousPosts = queryClient.getQueryData<InfiniteData>([queryKey]);

      queryClient.setQueryData<InfiniteData>([queryKey], (prev) => {
        return {
          ...prev,
          pages: prev?.pages?.map((page) => ({
            ...page,
            posts: page.posts.map((post) => {
              if (post._id === postId) {
                if (post.likes.includes(userId)) {
                  const filteredLikes = post.likes.filter(
                    (id) => id !== userId
                  );
                  return { ...post, likes: filteredLikes };
                }
                return { ...post, likes: [...post.likes, userId] };
              }
              return post;
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData([queryKey], context?.previousPosts);
    },
    onSuccess(data, postId) {
      queryClient.setQueryData<InfiniteData>([queryKey], (prev) => {
        return {
          ...prev,
          pages: prev?.pages?.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId ? { ...post, likes: [...data] } : post
            ),
          })),
        };
      });
    },
  });
}

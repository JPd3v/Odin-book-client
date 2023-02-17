import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { useParams } from 'react-router-dom';
import type { InfiniteData, InfiniteDatacontext } from '../types';

async function likePost(postId: string, userToken: string) {
  const req = await axiosConfig.post(
    `/posts/${postId}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function usePostLike() {
  const { userToken, userInfo } = useAuth();
  const queryClient = useQueryClient();

  const params = useParams();
  const userId = userInfo?._id ?? '';

  const profileUserId = params.id ?? '';

  return useMutation<string[], unknown, string, InfiniteDatacontext>(
    ['user posts', profileUserId],
    {
      mutationFn: (postId) => likePost(postId, userToken ?? ''),
      onMutate: async (postId) => {
        await queryClient.cancelQueries(['user posts', profileUserId]);
        const previousPosts = queryClient.getQueryData<InfiniteData>([
          'user posts',
          userId,
        ]);
        queryClient.setQueryData<InfiniteData>(
          ['user posts', profileUserId],
          (prev) => {
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
          }
        );

        return { previousPosts };
      },
      onError: (_err, _postId, context) => {
        queryClient.setQueryData(
          ['user posts', profileUserId],
          context?.previousPosts
        );
      },
      onSuccess(data, postId) {
        queryClient.setQueryData<InfiniteData>(
          ['user posts', profileUserId],
          (prev) => {
            return {
              ...prev,
              pages: prev?.pages?.map((page) => ({
                ...page,
                posts: page.posts.map((post) =>
                  post._id === postId ? { ...post, likes: [...data] } : post
                ),
              })),
            };
          }
        );
      },
    }
  );
}

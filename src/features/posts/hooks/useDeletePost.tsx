import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { InfiniteData } from 'features/posts/types';
import { useAuth } from 'hooks/index';

async function deletePost(postId: string, userToken: string) {
  const req = await axiosConfig.delete(`/posts/${postId}`, {
    headers: { authorization: `Bearer ${userToken}` },
  });
  return req.data;
}

export default function useDeletePost(
  queryKey: string | Array<string | number>
) {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation([queryKey], {
    mutationFn: (postId: string) => deletePost(postId, userToken ?? ''),
    onMutate: async (postId) => {
      await queryClient.cancelQueries([queryKey]);

      const previousPosts = queryClient.getQueryData<InfiniteData>([queryKey]);
      queryClient.setQueryData<InfiniteData>([queryKey], (prev) => {
        return {
          ...prev,
          pages: prev?.pages?.map((page) => ({
            ...page,
            posts: page.posts.filter((post) => post._id !== postId),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_error, _var, context) => {
      queryClient.setQueryData<InfiniteData>(
        [queryKey],
        context?.previousPosts
      );
    },
  });
}

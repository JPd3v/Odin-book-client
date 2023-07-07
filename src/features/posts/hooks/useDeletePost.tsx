import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { InfiniteData } from 'features/posts/types';
import postKeys from 'features/posts/utils/postQuerykeyFactory';
import { deletePostFromCache } from 'features/posts/utils/updateInfinitePostsCache';
import { useAuth } from 'hooks/index';
import { IPost } from 'types';

async function deletePost(postId: string, userToken: string) {
  const req = await axiosConfig.delete(`/posts/${postId}`, {
    headers: { authorization: `Bearer ${userToken}` },
  });
  return req.data;
}

export default function useDeletePost() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IPost) => deletePost(post._id, userToken ?? ''),
    onMutate: async (post) => {
      await queryClient.cancelQueries(postKeys.all);

      const postCreatorId = post.creator._id;
      const postId = post._id;

      const previousFeedPosts = queryClient.getQueryData<InfiniteData>(
        postKeys.lists()
      );

      const previousProfilePosts = queryClient.getQueryData<InfiniteData>(
        postKeys.profile(postCreatorId)
      );

      const previousSinglePost = queryClient.getQueryData<InfiniteData>(
        postKeys.detail(postId)
      );

      queryClient.setQueryData<InfiniteData>(postKeys.lists(), (prev) =>
        deletePostFromCache(prev, post)
      );

      queryClient.setQueryData<InfiniteData>(
        postKeys.profile(postCreatorId),
        (prev) => deletePostFromCache(prev, post)
      );

      queryClient.setQueryData<IPost | null>(
        postKeys.detail(postId),
        (prev) => {
          if (!prev) return undefined;
          return null;
        }
      );

      return { previousFeedPosts, previousProfilePosts, previousSinglePost };
    },
    onError: (_error, post, context) => {
      const postCreatorId = post.creator._id;
      const postId = post._id;

      queryClient.setQueryData<InfiniteData>(
        postKeys.lists(),
        context?.previousFeedPosts
      );

      queryClient.setQueryData<InfiniteData>(
        postKeys.profile(postCreatorId),
        context?.previousProfilePosts
      );

      queryClient.setQueryData<InfiniteData>(
        postKeys.detail(postId),
        context?.previousSinglePost
      );
    },
  });
}

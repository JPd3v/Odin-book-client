import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import postKeys from 'features/posts/utils/postQuerykeyFactory';
import { IPost } from 'types';
import { updateInfinitePostsLikesCache } from 'features/posts/utils/updateInfinitePostsCache';
import type { InfiniteData } from '../types';

async function likePost(postId: string, userToken: string): Promise<string[]> {
  const req = await axiosConfig.post(
    `/posts/${postId}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function usePostLike() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IPost) => likePost(post._id, userToken as string),
    onMutate: async (post) => {
      const postId = post._id;
      const profileId = post.creator._id;

      await queryClient.cancelQueries(postKeys.all);

      const previousListPosts = queryClient.getQueryData<InfiniteData>(
        postKeys.lists()
      );

      const previousSinglePost = queryClient.getQueryData<IPost>(
        postKeys.detail(postId)
      );

      const previousProfilePosts = queryClient.getQueryData<IPost>(
        postKeys.profile(profileId)
      );

      queryClient.setQueryData<IPost>(postKeys.detail(postId), (prev) => {
        if (!prev) return undefined;
        if (prev.isLikedByUser) {
          return {
            ...prev,
            isLikedByUser: !prev.isLikedByUser,
            likesCount: prev.likesCount - 1,
          };
        }
        return {
          ...prev,
          isLikedByUser: !prev.isLikedByUser,
          likesCount: prev.likesCount + 1,
        };
      });

      queryClient.setQueryData<InfiniteData>(postKeys.lists(), (prev) =>
        updateInfinitePostsLikesCache(prev, postId)
      );

      queryClient.setQueryData<InfiniteData>(
        postKeys.profile(profileId),
        (prev) => updateInfinitePostsLikesCache(prev, postId)
      );

      return { previousListPosts, previousSinglePost, previousProfilePosts };
    },
    onError: (_err, post, context) => {
      const postId = post._id;
      const profileId = post.creator._id;

      queryClient.setQueryData(postKeys.lists(), context?.previousListPosts);

      queryClient.setQueryData(
        postKeys.profile(profileId),
        context?.previousProfilePosts
      );

      queryClient.setQueryData(
        postKeys.detail(postId),
        context?.previousSinglePost
      );
    },
  });
}

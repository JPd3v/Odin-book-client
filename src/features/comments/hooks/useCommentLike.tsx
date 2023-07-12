import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'hooks/index';
import { axiosConfig } from 'config/index';
import type { IComment, InfiniteComments } from 'types/index';
import commentKeys from 'features/comments/utils/commentQuerykeyFactory';
import { updateLikeCommentInCache } from 'features/comments/utils/updateInfiniteCommentsCache';

async function likeComment(
  comment: IComment,
  userToken: string
): Promise<string[]> {
  const req = await axiosConfig.post(
    `/comments/${comment._id}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useCommentLike() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: IComment) => likeComment(comment, userToken ?? ''),
    onMutate: async (likedComment) => {
      const postId = likedComment.post_id;
      const commentId = likedComment._id;

      await queryClient.cancelQueries(commentKeys.post(postId));

      const previousComments = queryClient.getQueryData<InfiniteComments>(
        commentKeys.post(postId)
      );
      queryClient.setQueryData<InfiniteComments>(
        commentKeys.post(postId),
        (prev) => updateLikeCommentInCache(prev, commentId)
      );

      return { previousComments };
    },
    onError(_error, likedComment, context) {
      const postId = likedComment.post_id;

      queryClient.setQueryData(
        commentKeys.post(postId),
        context?.previousComments
      );
    },
  });
}

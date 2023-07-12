import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import commentKeys from 'features/comments/utils/commentQuerykeyFactory';
import { deleteCommentInCache } from 'features/comments/utils/updateInfiniteCommentsCache';
import { useAuth } from 'hooks/index';
import { IComment, InfiniteComments } from 'types';

async function deleteComment(commentId: string, userToken: string) {
  const req = await axiosConfig.delete(`/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeleteComment() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment: IComment) =>
      deleteComment(comment._id, userToken as string),
    onSuccess: (_response, deletedComment) => {
      const postId = deletedComment.post_id;
      queryClient.setQueryData<InfiniteComments>(
        commentKeys.post(postId),
        (prev) => deleteCommentInCache(prev, deletedComment)
      );
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import replyKeys from 'features/replies/utils/replyQuerykeyFactory';
import { deleteReplyInCache } from 'features/replies/utils/updateInfiniteRepliesCache';
import { useAuth } from 'hooks/index';
import { IReply, InfiniteReplies } from 'types';

async function deleteReply(replyId: string, userToken: string) {
  const req = await axiosConfig.delete(`/replies/${replyId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeleteReply() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reply: IReply) => deleteReply(reply._id, userToken as string),
    onMutate: async (deletedReply) => {
      const commentId = deletedReply.comment_id;
      const replyId = deletedReply._id;

      await queryClient.cancelQueries(replyKeys.reply(commentId));

      const previousReplies = queryClient.getQueryData<InfiniteReplies>(
        replyKeys.reply(commentId)
      );

      queryClient.setQueryData<InfiniteReplies>(
        replyKeys.reply(commentId),
        (prev) => deleteReplyInCache(prev, replyId)
      );

      return { previousReplies };
    },
    onError: (_error, reply, context) => {
      const commentId = reply.comment_id;
      queryClient.setQueryData<InfiniteReplies>(
        replyKeys.reply(commentId),
        context?.previousReplies
      );
    },
  });
}

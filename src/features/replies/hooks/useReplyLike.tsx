import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IReply, InfiniteReplies } from 'types/index';
import replyKeys from 'features/replies/utils/replyQuerykeyFactory';
import { likeReplyInCache } from 'features/replies/utils/updateInfiniteRepliesCache';

async function likeReply(reply: IReply, userToken: string) {
  const req = await axiosConfig.post(
    `/replies/${reply._id}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );

  return req.data;
}

export default function useReplyLike() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reply: IReply) => likeReply(reply, userToken as string),
    onMutate: async (replyLiked) => {
      const commentId = replyLiked.comment_id;
      const replyId = replyLiked._id;

      await queryClient.cancelQueries(replyKeys.reply(commentId));

      const previousReplies = queryClient.getQueryData<InfiniteReplies>(
        replyKeys.reply(commentId)
      );

      queryClient.setQueryData<InfiniteReplies>(
        replyKeys.reply(commentId),
        (prev) => likeReplyInCache(prev, replyId)
      );

      return { previousReplies };
    },
    onError: (_err, replyLiked, context) => {
      const commentId = replyLiked.comment_id;

      queryClient.setQueryData(
        replyKeys.reply(commentId),
        context?.previousReplies
      );
    },
  });
}

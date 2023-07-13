import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IReply, InfiniteReplies } from 'types/index';
import replyKeys from 'features/replies/utils/replyQuerykeyFactory';
import { newReplyOnCache } from 'features/replies/utils/updateInfiniteRepliesCache';
import type { IAxiosDefaultErrors } from '../../posts/types';

interface IFormData {
  reply_text: string;
  commentId: string;
}

async function newReply(
  { reply_text, commentId }: IFormData,
  userToken: string | null | undefined
) {
  const req = await axiosConfig.post(
    `/replies/${commentId}/`,
    {
      reply_text,
    },
    { headers: { authorization: `Bearer ${userToken}` } }
  );

  return req.data;
}

export default function useNewReply() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<IReply, IAxiosDefaultErrors, IFormData, unknown>({
    mutationFn: (data) => newReply(data, userToken),
    onSuccess: (replyCreated) => {
      const commentId = replyCreated.comment_id;

      queryClient.setQueryData<InfiniteReplies>(
        replyKeys.reply(commentId),
        (prev) => newReplyOnCache(prev, replyCreated)
      );
    },
  });
}

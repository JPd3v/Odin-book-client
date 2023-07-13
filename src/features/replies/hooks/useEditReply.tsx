import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';
import replyKeys from 'features/replies/utils/replyQuerykeyFactory';
import { IReply, InfiniteReplies } from 'types';
import { editReplyInCache } from 'features/replies/utils/updateInfiniteRepliesCache';

async function editReply({ text, id }: ITextEdition, userToken: string) {
  const req = await axiosConfig.put(
    `/replies/${id}`,
    {
      content: { text },
    },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );

  return req.data;
}

export default function useEditReply() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<IReply, ITextEditionErrors, ITextEdition, unknown>({
    mutationFn: (data) => editReply(data, userToken ?? ''),
    onSuccess(editedReply) {
      const commentId = editedReply.comment_id;
      queryClient.setQueryData<InfiniteReplies>(
        replyKeys.reply(commentId),
        (prev) => editReplyInCache(prev, editedReply)
      );
    },
  });
}

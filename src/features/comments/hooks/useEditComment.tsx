import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';
import { IComment, InfiniteComments } from 'types';
import commentKeys from 'features/comments/utils/commentQuerykeyFactory';
import { editCommentInCache } from 'features/comments/utils/updateInfiniteCommentsCache';

async function editComment({ text, id }: ITextEdition, userToken: string) {
  const req = await axiosConfig.put(
    `/comments/${id}`,
    {
      content: { text },
    },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );

  return req.data;
}

export default function useEditComment() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<IComment, ITextEditionErrors, ITextEdition, unknown>({
    mutationFn: (data) => editComment(data, userToken as string),
    onSuccess: (editedComment) => {
      const postId = editedComment.post_id;
      queryClient.setQueryData<InfiniteComments>(
        commentKeys.post(postId),
        (prev) => editCommentInCache(prev, editedComment)
      );
    },
  });
}

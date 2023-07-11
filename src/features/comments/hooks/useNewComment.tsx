import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IComment, InfiniteComments } from 'types/index';
import { addNewCommentInCache } from 'features/comments/utils/updateInfiniteCommentsCache';
import commentKeys from 'features/comments/utils/commentQuerykeyFactory';
import type { IFormInputs, IAxiosDefaultErrors } from '../../posts/types';

interface INewComment {
  postId: string;
  formInputs: IFormInputs;
}

async function newComment(
  { postId, formInputs }: INewComment,
  userToken: string | null | undefined
) {
  const req = await axiosConfig.post(
    `/comments/${postId}`,
    { comment_text: formInputs.text },
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useNewComment() {
  const { userToken } = useAuth();

  const queryClient = useQueryClient();
  return useMutation<IComment, IAxiosDefaultErrors, INewComment>({
    mutationFn: (data) => newComment(data, userToken),
    onSuccess(returnedComment) {
      const commentPostId = returnedComment.post_id;

      queryClient.setQueryData<InfiniteComments>(
        commentKeys.post(commentPostId),
        (prev) => addNewCommentInCache(prev, returnedComment)
      );
    },
  });
}

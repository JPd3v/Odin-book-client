import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IComment, IPost } from 'types/index';
import type { IFormInputs, IAxiosDefaultErrors } from 'components/feed/types';
import { useParams } from 'react-router-dom';

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
  const params = useParams();
  const queryClient = useQueryClient();

  return useMutation<IComment, IAxiosDefaultErrors, INewComment>({
    mutationFn: (data) => newComment(data, userToken),
    onSuccess(data) {
      queryClient.setQueryData<IPost>(['post', params.id], (prev) => {
        if (prev) {
          return {
            ...prev,
            comments: [data, ...prev.comments],
          };
        }
        return undefined;
      });
    },
  });
}

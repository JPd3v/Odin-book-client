import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { useParams } from 'react-router-dom';
import type { IReply, IAxiosDefaultErrors, IPost } from 'types/index';

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
  const params = useParams();

  return useMutation<IReply, IAxiosDefaultErrors, IFormData>(
    ['post', params.id],
    {
      mutationFn: (data) => newReply(data, userToken),
      onSuccess: (data) => {
        const commentId = data.comment_id;

        queryClient.setQueryData<IPost>(['post', params.id], (prev) => {
          if (prev) {
            return {
              ...prev,
              comments: prev.comments.map((comment) =>
                comment._id === commentId
                  ? { ...comment, replies: [...comment.replies, data] }
                  : comment
              ),
            };
          }
          return undefined;
        });
      },
    }
  );
}

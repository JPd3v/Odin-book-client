import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'hooks/index';
import { axiosConfig } from 'config/index';
import type { IComment } from 'types/index';
import { IPost, IPostContext } from 'types/index';

import { useParams } from 'react-router-dom';

async function likeComment(comment: IComment, userToken: string) {
  const req = await axiosConfig.post(
    `/comments/${comment._id}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useCommentLike() {
  const { userToken, userInfo } = useAuth();
  const queryClient = useQueryClient();
  const params = useParams();

  return useMutation<string[], unknown, IComment, IPostContext>(
    ['post', params.id],
    {
      mutationFn: (comment) => likeComment(comment, userToken ?? ''),
      onMutate: async (currentComment) => {
        const userId = userInfo?._id ?? '';
        const commentId = currentComment._id;

        await queryClient.cancelQueries(['post', params.id]);

        const previousPost = queryClient.getQueryData<IPost>([
          'post',
          params.id,
        ]);

        queryClient.setQueryData<IPost>(['post', params.id], (prev) => {
          if (prev) {
            return {
              ...prev,
              comments: prev?.comments.map((comment) => {
                if (comment._id === commentId) {
                  if (comment.likes.includes(userId)) {
                    const filteredLikes = comment.likes.filter(
                      (id) => id !== userId
                    );
                    return { ...comment, likes: filteredLikes };
                  }
                  return { ...comment, likes: [...comment.likes, userId] };
                }
                return comment;
              }),
            };
          }
          return undefined;
        });
        return { previousPost };
      },
      onError(_error, _variables, context) {
        queryClient.setQueryData(['post', params.id], context?.previousPost);
      },
      onSuccess(data, currentComment) {
        const commentId = currentComment._id;

        queryClient.setQueryData<IPost>(['post', params.id], (prev) => {
          if (prev) {
            return {
              ...prev,
              comments: prev.comments.map((comment) => {
                return comment._id === commentId
                  ? { ...comment, likes: [...data] }
                  : comment;
              }),
            };
          }
          return undefined;
        });
      },
    }
  );
}

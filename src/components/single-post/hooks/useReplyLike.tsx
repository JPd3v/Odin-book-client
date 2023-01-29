import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { useParams } from 'react-router-dom';
import type { IReply, IPost } from 'types/index';

async function likeReply(reply: IReply, userToken: string) {
  const req = await axiosConfig.post(
    `/replies/${reply._id}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useReplyLike() {
  const { userToken, userInfo } = useAuth();
  const queryClient = useQueryClient();
  const params = useParams();

  return useMutation<string[], unknown, IReply>(['post', params.id], {
    mutationFn: (reply) => likeReply(reply, userToken ?? ''),
    onMutate: async (currentReply) => {
      const commentId = currentReply.comment_id;
      const replyId = currentReply._id;
      const userId = userInfo?._id ?? '';

      await queryClient.cancelQueries(['post', params.id]);

      const previousPosts = queryClient.getQueryData<IPost>([
        'post',
        params.id,
      ]);
      queryClient.setQueryData<IPost>(['post', params.id], (prev) => {
        if (prev) {
          return {
            ...prev,
            comments: prev.comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.map((reply) => {
                      if (reply._id === replyId) {
                        if (reply.likes.includes(userId)) {
                          const filteredLikes = reply.likes.filter(
                            (id) => id !== userId
                          );
                          return { ...reply, likes: filteredLikes };
                        }
                        return {
                          ...reply,
                          likes: [...reply.likes, userId],
                        };
                      }
                      return reply;
                    }),
                  }
                : comment
            ),
          };
        }

        return undefined;
      });

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      // NOTE : FIX  CONTEXT TYPE ERROR
      queryClient.setQueryData(['post', params.id], context?.previousPosts);
    },
    onSuccess(data, currentReply) {
      const commentId = currentReply.comment_id;
      const replyId = currentReply._id;

      queryClient.setQueryData<IPost>(['post', params.id], (prev) => {
        if (prev) {
          return {
            ...prev,
            comments: prev.comments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    replies: comment.replies.map((reply) =>
                      reply._id === replyId ? { ...reply, likes: data } : reply
                    ),
                  }
                : comment
            ),
          };
        }
        return undefined;
      });
    },
  });
}

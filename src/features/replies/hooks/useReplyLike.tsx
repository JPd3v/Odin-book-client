import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IReply } from 'types/index';
import type { InfiniteData } from '../../posts/types';

async function likeReply(reply: IReply, userToken: string) {
  const req = await axiosConfig.post(
    `/replies/${reply._id}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useReplyLike(
  queryKey: string | Array<string | number>
) {
  const { userToken, userInfo } = useAuth();
  const queryClient = useQueryClient();

  return useMutation([queryKey], {
    mutationFn: (reply: IReply) => likeReply(reply, userToken ?? ''),
    onMutate: async (currentReply) => {
      const postId = currentReply.post_id;
      const commentId = currentReply.comment_id;
      const replyId = currentReply._id;
      const userId = userInfo?._id ?? '';

      await queryClient.cancelQueries([queryKey]);

      const previousPosts = queryClient.getQueryData<InfiniteData>([queryKey]);
      queryClient.setQueryData<InfiniteData>([queryKey], (prev) => {
        return {
          ...prev,
          pages: prev?.pages?.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    comments: post.comments.map((comment) =>
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
                  }
                : post
            ),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      queryClient.setQueryData([queryKey], context?.previousPosts);
    },
    onSuccess(data, currentReply) {
      const postId = currentReply.post_id;
      const commentId = currentReply.comment_id;
      const replyId = currentReply._id;

      queryClient.setQueryData<InfiniteData>([queryKey], (prev) => {
        return {
          ...prev,
          pages: prev?.pages?.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    comments: post.comments.map((comment) =>
                      comment._id === commentId
                        ? {
                            ...comment,
                            replies: comment.replies.map((reply) =>
                              reply._id === replyId
                                ? { ...reply, likes: data }
                                : reply
                            ),
                          }
                        : comment
                    ),
                  }
                : post
            ),
          })),
        };
      });
    },
  });
}

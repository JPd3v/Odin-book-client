import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IReply } from 'types/index';
import type { IAxiosDefaultErrors, InfiniteData } from '../types';

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

  return useMutation<IReply, IAxiosDefaultErrors, IFormData>(['posts'], {
    mutationFn: (data) => newReply(data, userToken),
    onSuccess: (data) => {
      const commentId = data.comment_id;
      const postId = data.post_id;

      queryClient.setQueryData<InfiniteData>(['posts'], (prev) => {
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
                        ? { ...comment, replies: [...comment.replies, data] }
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

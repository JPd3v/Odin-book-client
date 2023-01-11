import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';
import type { IUserPost, Ireplies } from '../components/UserPost';

interface IFormData {
  reply_text: string;
  commentId: string;
}

interface InfiniteData {
  pages: Ipages[] | undefined;
}

interface Ipages {
  posts: IUserPost[];
}

interface IAxiosErrors {
  response: IErrorResponse;
}

interface IErrorResponse {
  status: number;
  data: { message?: string; errors?: IErrorMsg[] };
}

interface IErrorMsg {
  msg: string;
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

  return useMutation<Ireplies, IAxiosErrors, IFormData>(['posts'], {
    mutationFn: (data) => newReply(data, userToken),
    onSuccess: (data) => {
      const commentId = data.comment_id;

      queryClient.setQueryData<InfiniteData>(['posts'], (prev) => {
        return {
          ...prev,
          pages: prev?.pages?.map((page) => ({
            ...page,
            posts: page.posts.map((post) => ({
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === commentId
                  ? { ...comment, replies: [...comment.replies, data] }
                  : comment
              ),
            })),
          })),
        };
      });
    },
  });
}

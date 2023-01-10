import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';
import type { IFormInputs } from '../components/NewCommentForm';
import type { IUserPost, IComment } from '../components/UserPost';

interface INewComment {
  postId: string;
  formInputs: IFormInputs;
}

export interface InfiniteData {
  pages: Ipage[] | undefined;
}

interface Ipage {
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
  return useMutation<IComment, IAxiosErrors, INewComment>({
    mutationFn: (data) => newComment(data, userToken),
    onSuccess(data) {
      const commentPostId = data.post_id;

      queryClient.setQueryData<InfiniteData>(['posts'], (prev) => {
        return {
          ...prev,
          pages: prev?.pages?.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === commentPostId
                ? { ...post, comments: [data, ...post.comments] }
                : post
            ),
          })),
        };
      });
    },
  });
}

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
  pages: Ipages[];
}

interface Ipages {
  map(arg0: (result: IUserPost) => IUserPost): IUserPost;
  page: Array<IUserPost>;
}

interface IAxiosErrors {
  response: IErrorResponse;
}

interface IErrorResponse {
  status: number;
  data: { message: string; errors: IErrorMsg[] };
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
      // NOTE: COME LATER AND FIX TYPES ERROR

      queryClient.setQueryData<InfiniteData>(['posts'], (oldData) => ({
        ...oldData,
        pages: oldData?.pages.map((page) =>
          page.map((post) =>
            post._id === commentPostId
              ? {
                  ...post,
                  comments: [data, ...post.comments],
                }
              : post
          )
        ),
      }));
    },
  });
}

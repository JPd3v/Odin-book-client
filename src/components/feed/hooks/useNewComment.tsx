import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IComment } from 'types/index';
import type { IFormInputs, IAxiosDefaultErrors, InfiniteData } from '../types';

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

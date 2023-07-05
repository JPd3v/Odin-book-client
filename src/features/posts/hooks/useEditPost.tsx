import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';
import { InfiniteData } from 'features/posts/types';
import { IPost } from 'types';

async function editPost({ text, id }: ITextEdition, userToken: string) {
  const req = await axiosConfig.put<IPost>(
    `/posts/${id}/`,
    {
      content: {
        text,
      },
    },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useEditPost(queryKey: string | Array<string | number>) {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<IPost, ITextEditionErrors, ITextEdition, unknown>(
    [queryKey],
    {
      mutationFn: (data: ITextEdition) => editPost(data, userToken ?? ''),
      onSuccess: (editedPost) => {
        queryClient.setQueryData<InfiniteData>([queryKey], (prev) => {
          return {
            ...prev,
            pages: prev?.pages?.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post._id === editedPost._id ? editedPost : post
              ),
            })),
          };
        });
      },
    }
  );
}

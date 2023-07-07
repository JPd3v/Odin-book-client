import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';
import { InfiniteData } from 'features/posts/types';
import { IPost } from 'types';
import postKeys from 'features/posts/utils/postQuerykeyFactory';
import { editPostFromCache } from 'features/posts/utils/updateInfinitePostsCache';

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

export default function useEditPost() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<IPost, ITextEditionErrors, ITextEdition, unknown>({
    mutationFn: (data: ITextEdition) => editPost(data, userToken as string),
    onSuccess: (editedPost) => {
      const creatorId = editedPost.creator._id;
      const postId = editedPost._id;

      queryClient.setQueryData<IPost>(postKeys.detail(postId), editedPost);

      queryClient.setQueryData<InfiniteData>(postKeys.lists(), (prev) =>
        editPostFromCache(prev, editedPost)
      );

      queryClient.setQueryData<InfiniteData>(
        postKeys.profile(creatorId),
        (prev) => editPostFromCache(prev, editedPost)
      );
    },
  });
}

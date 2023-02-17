import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { useParams } from 'react-router-dom';
import { IPost, IPostContext } from 'types/index';

async function likePost(postId: string, userToken: string) {
  const req = await axiosConfig.post(
    `/posts/${postId}/like`,
    {},
    { headers: { authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function usePostLike() {
  const { userToken, userInfo } = useAuth();
  const queryClient = useQueryClient();
  const params = useParams();

  const userId = userInfo?._id ?? '';

  return useMutation<string[], unknown, string, IPostContext>(
    ['post', params.id],
    {
      mutationFn: (postId) => likePost(postId, userToken ?? ''),
      onMutate: async () => {
        await queryClient.cancelQueries(['post', params.id]);

        const previousPost = queryClient.getQueryData<IPost>([
          'post',
          params.id,
        ]);

        queryClient.setQueryData<IPost>(['post', params.id], (prev) => {
          if (prev) {
            if (prev.likes.includes(userId)) {
              const filteredLikes = prev.likes.filter((id) => id !== userId);
              return { ...prev, likes: filteredLikes };
            }
            return { ...prev, likes: [...prev.likes, userId] };
          }
          return undefined;
        });

        return { previousPost };
      },

      onError: (_err, _postId, context) => {
        queryClient.setQueryData(['post', params.id], context?.previousPost);
      },
      onSuccess(data) {
        queryClient.setQueryData<IPost>(['post', params.id], (prev) => {
          if (prev) {
            return { ...prev, likes: [...data] };
          }
          return undefined;
        });
      },
    }
  );
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { useParams } from 'react-router-dom';

async function deletePost(postId: string, userToken: string) {
  const req = await axiosConfig.delete(`/posts/${postId}`, {
    headers: { authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeletePost() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  const params = useParams();
  const userId = params.id ?? '';

  return useMutation(['user posts', userId], {
    mutationFn: (postId: string) => deletePost(postId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user posts', userId] });
    },
  });
}

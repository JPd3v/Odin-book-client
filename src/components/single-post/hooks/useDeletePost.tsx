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
  const params = useParams();
  const queryClient = useQueryClient();

  return useMutation(['post', params.id], {
    mutationFn: (postId: string) => deletePost(postId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', params.id] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { useParams } from 'react-router-dom';

async function deleteComment(commentId: string, userToken: string) {
  const req = await axiosConfig.delete(`/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeleteComment() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  const params = useParams();
  const profileUserId = params.id ?? '';

  return useMutation(['user posts', profileUserId], {
    mutationFn: (commentId: string) =>
      deleteComment(commentId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user posts', profileUserId],
      });
    },
  });
}

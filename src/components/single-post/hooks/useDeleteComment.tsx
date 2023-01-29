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
  const params = useParams();
  const queryClient = useQueryClient();

  return useMutation(['post', params.id], {
    mutationFn: (commentId: string) =>
      deleteComment(commentId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', params.id] });
    },
  });
}

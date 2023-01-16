import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';

async function deleteComment(commentId: string, userToken: string) {
  const req = await axiosConfig.delete(`/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeleteComment() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(['posts'], {
    mutationFn: (commentId: string) =>
      deleteComment(commentId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

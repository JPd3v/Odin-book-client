import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';

async function deleteReply(replyId: string, userToken: string) {
  const req = await axiosConfig.delete(`/replies/${replyId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeleteReply() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(['posts'], {
    mutationFn: (replyId: string) => deleteReply(replyId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

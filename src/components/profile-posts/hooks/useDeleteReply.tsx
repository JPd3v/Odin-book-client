import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { useParams } from 'react-router-dom';

async function deleteReply(replyId: string, userToken: string) {
  const req = await axiosConfig.delete(`/replies/${replyId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeleteReply() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  const params = useParams();
  const profileUserId = params.id ?? '';

  return useMutation(['user posts', profileUserId], {
    mutationFn: (replyId: string) => deleteReply(replyId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user posts', profileUserId],
      });
    },
  });
}

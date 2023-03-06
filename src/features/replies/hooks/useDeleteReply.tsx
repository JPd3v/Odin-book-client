import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';

async function deleteReply(replyId: string, userToken: string) {
  const req = await axiosConfig.delete(`/replies/${replyId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeleteReply(
  queryKey: string | Array<string | number>
) {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation([queryKey], {
    mutationFn: (replyId: string) => deleteReply(replyId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';

async function deleteComment(commentId: string, userToken: string) {
  const req = await axiosConfig.delete(`/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeleteComment(
  queryKey: string | Array<string | number>
) {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation([queryKey], {
    mutationFn: (commentId: string) =>
      deleteComment(commentId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}

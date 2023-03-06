import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';

async function deletePost(postId: string, userToken: string) {
  const req = await axiosConfig.delete(`/posts/${postId}`, {
    headers: { authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useDeletePost(
  queryKey: string | Array<string | number>
) {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation([queryKey], {
    mutationFn: (postId: string) => deletePost(postId, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
}

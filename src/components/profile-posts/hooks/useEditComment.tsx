import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';
import { useParams } from 'react-router-dom';

async function editComment({ text, id }: ITextEdition, userToken: string) {
  const req = await axiosConfig.put(
    `/comments/${id}`,
    {
      content: { text },
    },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );

  return req.data;
}

export default function useEditComment() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  const params = useParams();
  const profileUserId = params.id ?? '';

  return useMutation<unknown, ITextEditionErrors, ITextEdition, unknown>(
    ['user posts', profileUserId],
    {
      mutationFn: (data) => editComment(data, userToken ?? ''),
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ['user posts', profileUserId],
        });
      },
    }
  );
}

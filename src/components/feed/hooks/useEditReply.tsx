import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';

async function editReply({ text, id }: ITextEdition, userToken: string) {
  const req = await axiosConfig.put(
    `/replies/${id}`,
    {
      content: { text },
    },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );

  return req.data;
}

export default function useEditReply() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<unknown, ITextEditionErrors, ITextEdition, unknown>(
    ['posts'],
    {
      mutationFn: (data) => editReply(data, userToken ?? ''),
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      },
    }
  );
}

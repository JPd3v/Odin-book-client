import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';
import { useParams } from 'react-router-dom';

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
  const params = useParams();
  const queryClient = useQueryClient();
  return useMutation<unknown, ITextEditionErrors, ITextEdition, unknown>(
    ['post', params.id],
    {
      mutationFn: (data) => editReply(data, userToken ?? ''),
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['post', params.id] });
      },
    }
  );
}

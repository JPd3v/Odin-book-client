import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';
import { useParams } from 'react-router-dom';

async function editPost({ text, id }: ITextEdition, userToken: string) {
  const req = await axiosConfig.put(
    `/posts/${id}/`,
    {
      content: {
        text,
      },
    },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useEditPost() {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();

  const params = useParams();
  const userId = params.id ?? '';

  return useMutation<unknown, ITextEditionErrors, ITextEdition, unknown>(
    ['user posts', userId],
    {
      mutationFn: (data: ITextEdition) => editPost(data, userToken ?? ''),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user posts', userId] });
      },
    }
  );
}

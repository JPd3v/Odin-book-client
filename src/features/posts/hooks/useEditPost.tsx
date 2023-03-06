import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { ITextEdition, ITextEditionErrors } from 'components/common/index';

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

export default function useEditPost(queryKey: string | Array<string | number>) {
  const { userToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<unknown, ITextEditionErrors, ITextEdition, unknown>(
    [queryKey],
    {
      mutationFn: (data: ITextEdition) => editPost(data, userToken ?? ''),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      },
    }
  );
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IFormInputs, IAxiosDefaultErrors } from '../types';

async function newPost(
  formInputs: IFormInputs,
  userToken: string | null | undefined
) {
  const req = await axiosConfig.post(
    '/posts/',
    {
      content: formInputs,
    },
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}
export default function useNewPost() {
  const { userToken } = useAuth();
  const queryCLient = useQueryClient();
  return useMutation<unknown, IAxiosDefaultErrors, IFormInputs>(['posts'], {
    mutationFn: (formInputs) => newPost(formInputs, userToken),
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ['posts'], exact: true });
    },
  });
}

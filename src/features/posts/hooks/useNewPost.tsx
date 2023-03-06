import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IFormInputs, IAxiosDefaultErrors } from '../types';

async function newPost(
  formInputs: IFormInputs,
  userToken: string | null | undefined
) {
  const formData = new FormData();
  formData.append('text', formInputs.text);

  if (formInputs.images) {
    for (let i = 0; i < formInputs.images.length; i += 1) {
      formData.append('images', formInputs.images[i]);
    }
  }
  const req = await axiosConfig.post('/posts/', formData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return req.data;
}
export default function useNewPost(queryKey: string) {
  const { userToken } = useAuth();
  const queryCLient = useQueryClient();
  return useMutation<unknown, IAxiosDefaultErrors, IFormInputs>([queryKey], {
    mutationFn: (formInputs) => newPost(formInputs, userToken),
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: [queryKey], exact: true });
    },
  });
}

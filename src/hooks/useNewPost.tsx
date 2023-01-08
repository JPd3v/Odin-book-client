import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';
import type { IFormInputs } from '../components/NewCommentForm';

interface IAxiosErrors {
  response: IErrorResponse;
}

interface IErrorResponse {
  status: number;
  data: { message: string; errors: IErrorMsg[] };
}

interface IErrorMsg {
  msg: string;
}

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
  return useMutation<unknown, IAxiosErrors, IFormInputs>(['posts'], {
    mutationFn: (formInputs) => newPost(formInputs, userToken),
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ['posts'], exact: true });
    },
  });
}

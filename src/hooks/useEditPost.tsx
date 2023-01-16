import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';

interface IFormData {
  text: string;
  id: string;
}

interface IAxiosErrors {
  response: IErrorResponse;
}

interface IErrorResponse {
  status: number;
  data: { message?: string; errors?: IErrorMsg[] };
}

interface IErrorMsg {
  msg: string;
}

export type { IFormData, IAxiosErrors };

async function editPost({ text, id }: IFormData, userToken: string) {
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
  return useMutation<unknown, IAxiosErrors, IFormData, unknown>(['posts'], {
    mutationFn: (data: IFormData) => editPost(data, userToken ?? ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

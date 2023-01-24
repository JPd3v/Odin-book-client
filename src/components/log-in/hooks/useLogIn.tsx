import { useMutation } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IAxiosDefaultErrors } from 'types/index';
import type { IFormInputs, IResponseData } from '../types';

async function logIn({ username, password }: IFormInputs) {
  const request = await axiosConfig.post<IResponseData>(
    '/users/log-in',
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  );

  return request.data;
}

export default function useLogIn() {
  const { setUserToken, setUserInfo } = useAuth();

  return useMutation<IResponseData, IAxiosDefaultErrors, IFormInputs>({
    mutationFn: (formData) => {
      return logIn(formData);
    },
    onSuccess: (response) => {
      setUserToken?.(response.token);
      setUserInfo?.(response.userInfo);
    },
  });
}

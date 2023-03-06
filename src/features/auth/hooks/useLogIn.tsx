import { useMutation } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IAxiosDefaultErrors } from 'types/';
import type { IResponseData, ILogInFormInputs } from '../types';

async function logIn({ username, password }: ILogInFormInputs) {
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

  return useMutation<IResponseData, IAxiosDefaultErrors, ILogInFormInputs>({
    mutationFn: (formData) => {
      return logIn(formData);
    },
    onSuccess: (response) => {
      setUserToken?.(response.token);
      setUserInfo?.(response.userInfo);
    },
  });
}

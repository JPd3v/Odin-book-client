import { useMutation } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IAxiosDefaultErrors } from 'types/index';
import type { IResponseData } from '../types';

async function logInAsGuest() {
  const request = await axiosConfig.get<IResponseData>(
    '/users/log-in/guest-account',
    {
      withCredentials: true,
    }
  );

  return request.data;
}

export default function useLogInAsGuest() {
  const { setUserToken, setUserInfo } = useAuth();

  return useMutation<IResponseData, IAxiosDefaultErrors, unknown>({
    mutationFn: logInAsGuest,

    onSuccess: (response) => {
      setUserToken?.(response.token);
      setUserInfo?.(response.userInfo);
    },
  });
}

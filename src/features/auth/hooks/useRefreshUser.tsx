// eslint-disable-next-line import/no-cycle
import { axiosConfig } from 'config/index';
import { useMutation } from '@tanstack/react-query';
import { IResponseData } from '../types';
import useAuth from './useAuth';

async function refresh() {
  const req = await axiosConfig.get<IResponseData>('/users/refresh-token', {
    withCredentials: true,
  });

  return req.data;
}

export default function useRefreshUser() {
  const { setUserToken, setUserInfo, logOutUser } = useAuth();

  return useMutation({
    mutationFn: () => {
      return refresh();
    },
    onSuccess: (response) => {
      setUserToken?.(response.token);
      setUserInfo?.(response.userInfo);
    },
    onError() {
      logOutUser?.();
    },
  });
}

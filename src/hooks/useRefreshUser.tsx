import { useMutation } from '@tanstack/react-query';
import AxiosConfig from '../config/axiosConfig';
// eslint-disable-next-line import/no-cycle
import useAuth from './useAuth';

import type { IUserInfo } from '../context/AuthContext';

interface IResponseData {
  token: string;
  userInfo: IUserInfo;
}

async function refresh() {
  const req = await AxiosConfig.get<IResponseData>('/users/refresh-token', {
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

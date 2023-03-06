import { useMutation } from '@tanstack/react-query';
import { axiosConfig } from '../../../config/index';
import useAuth from './useAuth';

export default function useLogOut() {
  const { userToken, logOutUser } = useAuth();

  function logOut() {
    const req = axiosConfig.post(
      '/users/log-out',
      {},
      {
        headers: { Authorization: `Bearer ${userToken}` },
        withCredentials: true,
      }
    );

    return req;
  }

  return useMutation({
    mutationFn: logOut,
    onSuccess() {
      logOutUser?.();
    },
  });
}

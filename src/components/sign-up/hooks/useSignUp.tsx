import { useMutation } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IResponseData } from 'components/log-in/index';
import type { IAxiosDefaultErrors } from 'types/index';
import type { IFormInputs } from '../types';

async function postSignUp(userData: IFormInputs) {
  const req = await axiosConfig.post(`/users/sign-up`, userData, {
    withCredentials: true,
  });
  return req.data;
}

export default function UseSignUp() {
  const { setUserToken, setUserInfo } = useAuth();

  return useMutation<IResponseData, IAxiosDefaultErrors, IFormInputs>({
    mutationFn: (formInputs: IFormInputs) => postSignUp(formInputs),
    onSuccess: (data) => {
      setUserToken?.(data.token);
      setUserInfo?.(data.userInfo);
    },
  });
}

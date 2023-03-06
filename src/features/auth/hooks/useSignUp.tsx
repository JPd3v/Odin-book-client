import { useMutation } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IAxiosDefaultErrors } from 'types/';
import type { IResponseData, ISignUpFormInputs } from '../types';

async function postSignUp(userData: ISignUpFormInputs) {
  const req = await axiosConfig.post(`/users/sign-up`, userData, {
    withCredentials: true,
  });
  return req.data;
}

export default function UseSignUp() {
  const { setUserToken, setUserInfo } = useAuth();

  return useMutation<IResponseData, IAxiosDefaultErrors, ISignUpFormInputs>({
    mutationFn: (formInputs: ISignUpFormInputs) => postSignUp(formInputs),
    onSuccess: (data) => {
      setUserToken?.(data.token);
      setUserInfo?.(data.userInfo);
    },
  });
}

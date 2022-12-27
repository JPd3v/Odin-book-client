import { useMutation } from '@tanstack/react-query';
import axiosConfiguration from '../config/axiosConfig';
import type { IUserInfo } from '../context/AuthContext';
import useAuth from './useAuth';

interface IFormInputs {
  username: string;
  password: string;
}

interface IResponseData {
  token: string;
  userInfo: IUserInfo;
}

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

async function logIn({ username, password }: IFormInputs) {
  const request = await axiosConfiguration.post<IResponseData>(
    '/users/log-in',
    {
      username,
      password,
    }
  );

  return request.data;
}

export default function useLogIn() {
  const { setUserToken, setUserInfo } = useAuth();

  return useMutation<IResponseData, IAxiosErrors, IFormInputs>({
    mutationFn: (formData) => {
      return logIn(formData);
    },
    onSuccess: (response) => {
      setUserToken?.(response.token);
      setUserInfo?.(response.userInfo);
    },
  });
}

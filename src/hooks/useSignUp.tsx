import { useMutation } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';
import type { IUserInfo } from '../context/AuthContext';

interface IFormInputs {
  first_name: string;
  last_name: string;
  gender: GenderEnum;
  birthday: string;
  username: string;
  password: string;
  confirm_password: string;
}

enum GenderEnum {
  female = 'female',
  male = 'male',
  other = 'other',
}
export type { IFormInputs, GenderEnum };

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

async function postSignUp(userData: IFormInputs) {
  const req = await axiosConfig.post(`/users/sign-up`, userData, {
    withCredentials: true,
  });
  return req.data;
}

export default function UseSignup() {
  const { setUserToken, setUserInfo } = useAuth();

  return useMutation<IResponseData, IAxiosErrors, IFormInputs>({
    mutationFn: (formInputs: IFormInputs) => postSignUp(formInputs),
    onSuccess: (data) => {
      setUserToken?.(data.token);
      setUserInfo?.(data.userInfo);
    },
  });
}

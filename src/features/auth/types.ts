import type { IUserInfo } from 'context/index';

interface ISignUpFormInputs {
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

interface ILogInFormInputs {
  username: string;
  password: string;
}
interface IResponseData {
  token: string;
  userInfo: IUserInfo;
}

export type { ISignUpFormInputs, GenderEnum, ILogInFormInputs, IResponseData };

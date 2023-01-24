import type { IUserInfo } from 'context/index';

interface IFormInputs {
  username: string;
  password: string;
}
interface IResponseData {
  token: string;
  userInfo: IUserInfo;
}

export type { IFormInputs, IResponseData };

import type { IUser } from 'types/index';

interface IUserProfile {
  profile_image: IProfileImage;
  _id: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: string;
  friend_requests: string[];
  friend_list: IUser[];
}

interface IProfileImage {
  public_id?: string;
  img: string;
}

interface IAxiosErrors {
  response: IErrorResponse;
}

interface IErrorResponse {
  status: number;
  data: IErrorMsg;
}

interface IErrorMsg {
  message: string;
}

export type { IUserProfile, IAxiosErrors };

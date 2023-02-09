interface IUserInfo {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  gender: string;
  birthday: string;
  email: string;
}

interface IAuthContext {
  userToken?: string | null | undefined;
  userInfo?: IUserInfo;
  setUserToken?: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
  setUserInfo?: React.Dispatch<React.SetStateAction<IUserInfo>>;
  logOutUser?: () => void;
}

export type { IUserInfo, IAuthContext };

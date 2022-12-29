import { createContext, useMemo, useState } from 'react';

interface Ichildren {
  children: React.ReactElement;
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

interface IUserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  profileImg: string;
}

export type { IUserInfo };

const initialUSerInfo = {
  _id: '',
  firstName: '',
  lastName: '',
  profileImg: '',
};

export const AuthContext = createContext<IAuthContext>({});

export default function ContextProvider({ children }: Ichildren) {
  const [userToken, setUserToken] = useState<null | string | undefined>(
    undefined
  );
  const [userInfo, setUserInfo] = useState<IUserInfo>(initialUSerInfo);

  function logOutUser() {
    setUserToken(null);
    setUserInfo(initialUSerInfo);
  }

  const value = useMemo(
    () => ({
      userToken,
      setUserToken,
      setUserInfo,
      userInfo,
      logOutUser,
    }),
    [userToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

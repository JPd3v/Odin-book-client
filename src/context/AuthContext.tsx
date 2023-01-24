import { createContext, useMemo, useState } from 'react';
import type { IUserInfo, IAuthContext } from './types';

interface Ichildren {
  children: React.ReactElement;
}

const initialUSerInfo = {
  _id: '',
  first_name: '',
  last_name: '',
  profile_image: '',
  friend_requests: [''],
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
    [userToken, userInfo]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

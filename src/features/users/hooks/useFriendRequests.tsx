import { useQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import useAuth from 'features/auth/hooks/useAuth';
import { IUser } from 'types/index';

async function GetFriendRequest(userId: string, userToken: string) {
  const req = await axiosConfig.get(`users/${userId}/friends-requests`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function useFriendRequest() {
  const { userToken, userInfo } = useAuth();

  return useQuery<IUser[]>(['friend requests'], {
    queryFn: () => GetFriendRequest(userInfo?._id ?? '', userToken ?? ''),
  });
}

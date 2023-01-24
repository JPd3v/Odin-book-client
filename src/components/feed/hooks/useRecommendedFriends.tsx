import { useQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IUser } from 'types/index';
import type { IAxiosDefaultErrors } from '../types';

async function RecommendedFriends(userToken: string, pageSize = 5) {
  const req = await axiosConfig.get(
    `/users/recommended-friends?pagesize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );

  return req.data;
}

export default function useRecommendedFriends() {
  const { userToken } = useAuth();
  return useQuery<IUser[], IAxiosDefaultErrors>({
    queryKey: ['recommended friends'],
    queryFn: () => RecommendedFriends(userToken ?? ''),
  });
}

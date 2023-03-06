import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import type { IUserProfile, IAxiosErrors } from '../types';

async function userProfile(userId: string, userToken: string) {
  const req = await axiosConfig.get(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return req.data;
}

export default function useUserProfile() {
  const params = useParams();
  const { userToken } = useAuth();

  return useQuery<IUserProfile, IAxiosErrors>(['user', params.id], {
    queryFn: () => userProfile(params.id ?? '', userToken ?? ''),
  });
}

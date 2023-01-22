import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';

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

interface IProfileImage {
  public_id?: string;
  img: string;
}

interface IFriends {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image: IProfileImage;
}

interface IUserProfile {
  profile_image: IProfileImage;
  _id: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: string;
  friend_requests: string[];
  friend_list: IFriends[];
}

export type { IFriends, IUserProfile };

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
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 2,
  });
}

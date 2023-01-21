import { useQuery } from '@tanstack/react-query';
import axiosConfig from '../config/axiosConfig';
import useAuth from './useAuth';

interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image: { img: string };
}

interface IAxiosError {
  response: IErrorResponse;
}

interface IErrorResponse {
  data: IErrorData;
}

interface IErrorData {
  message: string;
}

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
  return useQuery<IUser[], IAxiosError>({
    queryKey: ['recommended friends'],
    queryFn: () => RecommendedFriends(userToken ?? ''),
  });
}

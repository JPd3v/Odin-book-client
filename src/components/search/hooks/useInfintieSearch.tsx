import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { IUser } from 'types/index';
// import { Isearch } from '../types';
import useAuth from 'hooks/useAuth';

async function search(
  userToken: string,
  firstName: string,
  lastName?: string,
  pageParam = 1,
  pageSize = 5
) {
  const req = await axiosConfig.get(
    `/users/search?firstName=${firstName}&lastName=${lastName}&page=${pageParam}&pagesize=${pageSize}`,
    {
      headers: { Authorization: `Bearer ${userToken}` },
    }
  );

  return req.data;
}

export default function useSearch(queryText: string) {
  const { userToken } = useAuth();

  const array = queryText.split(' ');
  const firstName = array[0];
  const lastName = array[1];

  return useInfiniteQuery(['search', firstName, lastName], {
    queryFn: ({ pageParam = 1 }) =>
      search(userToken ?? '', firstName, lastName, pageParam),
    enabled: !!firstName,
  });
}

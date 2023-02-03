import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { IAxiosDefaultErrors } from 'types';
import useAuth from 'hooks/useAuth';
import { IPage } from '../types';

async function search(
  userToken: string,
  firstName: string,
  lastName?: string,
  pageParam = 1,
  pageSize = 5
) {
  // `/users/search?firstName=${firstName}&lastName=${lastName}&page=${pageParam}&pagesize=${pageSize}`,

  const req = await axiosConfig.get(`/users/search`, {
    params: {
      firstName,
      page: pageParam,
      pageSize,
      lastName: lastName ?? '',
    },
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return { users: req.data };
}

export default function useSearch(queryText: string) {
  const { userToken } = useAuth();

  const stringToArray = queryText?.trim().split(' ');

  const firstName = stringToArray[0] ?? '';
  const lastName = stringToArray[1] ?? '';

  return useInfiniteQuery<IPage, IAxiosDefaultErrors, IPage>(
    ['search', `${firstName} ${lastName}`],
    {
      queryFn: ({ pageParam = 1 }) =>
        search(userToken ?? '', firstName, lastName, pageParam),
      enabled: !!firstName,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.users.length ? allPages.length + 1 : undefined,
    }
  );
}

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks';
import { IPost, IAxiosDefaultErrors } from 'types/index';

async function getPost(postId: string, userToken: string) {
  const req = await axiosConfig.get(`/posts/${postId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function usePost(queryKey: string | Array<string | number>) {
  const params = useParams();
  const { userToken } = useAuth();

  return useQuery<IPost, IAxiosDefaultErrors>([queryKey], {
    queryFn: () => getPost(params.id ?? '', userToken ?? ''),
  });
}

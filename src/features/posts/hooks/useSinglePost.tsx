import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks';
import { IPost, IAxiosDefaultErrors } from 'types/index';
import postKeys from 'features/posts/utils/postQuerykeyFactory';

async function getPost(postId: string, userToken: string) {
  const req = await axiosConfig.get(`/posts/${postId}`, {
    headers: { Authorization: `Bearer ${userToken}` },
  });

  return req.data;
}

export default function usePost() {
  const paramsId = useParams().id as string;
  const { userToken } = useAuth();

  return useQuery<IPost, IAxiosDefaultErrors>(postKeys.detail(paramsId), {
    queryFn: () => getPost(paramsId, userToken as string),
  });
}

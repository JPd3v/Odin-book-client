import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import postKeys from 'features/posts/utils/postQuerykeyFactory';
import { IPost } from 'types';
import { addNewPostToCache } from 'features/posts/utils/updateInfinitePostsCache';
import {
  type IFormInputs,
  type IAxiosDefaultErrors,
  InfiniteData,
} from '../types';

async function newPost(
  formInputs: IFormInputs,
  userToken: string | null | undefined
) {
  const formData = new FormData();
  formData.append('text', formInputs.text);

  if (formInputs.images) {
    for (let i = 0; i < formInputs.images.length; i += 1) {
      formData.append('images', formInputs.images[i]);
    }
  }
  const req = await axiosConfig.post('/posts/', formData, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return req.data;
}
export default function useNewPost() {
  const { userToken } = useAuth();
  const queryCLient = useQueryClient();

  return useMutation<IPost, IAxiosDefaultErrors, IFormInputs>({
    mutationFn: (formInputs) => newPost(formInputs, userToken),
    onSuccess: (post) => {
      const profileId = post.creator._id;

      queryCLient.setQueryData(postKeys.detail(post._id), post);

      queryCLient.setQueryData<InfiniteData>(postKeys.lists(), (prev) =>
        addNewPostToCache(prev, post)
      );
      queryCLient.setQueryData<InfiniteData>(
        postKeys.profile(profileId),
        (prev) => addNewPostToCache(prev, post)
      );
    },
  });
}

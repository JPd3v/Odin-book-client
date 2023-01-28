import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useAuth } from 'hooks/index';
import { axiosConfig } from 'config/index';
import { IUser } from 'types/index';
import { IUserProfile } from '../types';

async function declineFriendRequest(userId: string, userToken: string) {
  const req = await axiosConfig.put(
    `users/friend-requests/${userId}/decline`,
    {},
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useDeclineFriendRequest() {
  const { userToken, userInfo } = useAuth();
  const params = useParams();
  const queryClient = useQueryClient();

  return useMutation(['user', params.id], {
    mutationFn: () => declineFriendRequest(params.id ?? '', userToken ?? ''),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', params.id] });

      const user = queryClient.getQueryData(['user', params.id]);

      queryClient.setQueryData<IUserProfile>(['user', params.id], (prev) => {
        if (prev === undefined) return undefined;

        return {
          ...prev,
          friend_list: prev?.friend_list?.filter(
            (friend) => friend._id !== userInfo?._id
          ),
        };
      });

      return { user };
    },

    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['user', params.id], context?.user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', params.id] });
      queryClient.setQueryData<IUser[] | undefined>(
        ['friend requests'],
        (prev) => {
          return prev?.filter((user) => user._id !== params.id);
        }
      );
    },
  });
}

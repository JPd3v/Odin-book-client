import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { axiosConfig } from 'config/index';
import { useAuth } from 'hooks/index';
import { IUserProfile } from '../types';

async function cancelFriendRequest(userId: string, userToken: string) {
  const req = await axiosConfig.put(
    `users/friend-requests/${userId}/cancel`,
    {},
    { headers: { Authorization: `Bearer ${userToken}` } }
  );
  return req.data;
}

export default function useCancelFriendRequest() {
  const { userToken, userInfo } = useAuth();
  const params = useParams();
  const queryClient = useQueryClient();
  return useMutation(['user', params.id], {
    mutationFn: () => cancelFriendRequest(params.id ?? '', userToken ?? ''),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['user', params.id] });

      const user = queryClient.getQueryData(['user', params.id]);

      queryClient.setQueryData<IUserProfile>(['user', params.id], (prev) => {
        if (prev === undefined) return undefined;

        return {
          ...prev,
          friend_requests: prev?.friend_requests?.filter(
            (friend) => friend !== userInfo?._id
          ),
        };
      });

      return { user };
    },

    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['user', params.id], context?.user);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user', params.id] });
    },
  });
}

import { useMutation } from '@tanstack/react-query';
import { userAdapter } from 'adapters';
import { axiosConfig } from 'config';
import { useAuth } from 'hooks';
import { IUserDetailsForm } from '../types';

async function updateUserInfo(
  userToken: string,
  inputs: Partial<IUserDetailsForm>
) {
  const req = await axiosConfig.put('/users/edit-info', inputs, {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  return userAdapter(req.data);
}

export default function useUpdateUserInfo() {
  const { userToken, setUserInfo } = useAuth();
  return useMutation<
    Partial<IUserDetailsForm>,
    unknown,
    Partial<IUserDetailsForm>
  >({
    mutationFn: (inputs) => updateUserInfo(userToken ?? '', inputs),
    onSuccess: (data) => {
      setUserInfo?.((prev) => ({ ...prev, ...data }));
    },
  });
}

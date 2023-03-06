import { useMutation } from '@tanstack/react-query';
import { axiosConfig } from 'config';
import { useAuth } from 'hooks';
import { IAxiosDefaultErrors } from 'types';

async function uploadProfileImg(imageFile: File, userToken: string) {
  const formData = new FormData();
  formData.append('profile_img', imageFile);

  const req = await axiosConfig.put('/users/edit-image', formData, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  return req.data;
}

export default function useUploadProfileImg() {
  const { userToken, setUserInfo } = useAuth();
  return useMutation<string, IAxiosDefaultErrors, File>({
    mutationFn: (imageFile) => uploadProfileImg(imageFile, userToken ?? ''),

    onSuccess: (data) => {
      setUserInfo?.((prev) => ({ ...prev, profile_image: data }));
    },
  });
}

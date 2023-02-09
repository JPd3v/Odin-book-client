/* eslint-disable react/jsx-props-no-spreading */
import useUploadProfileImg from 'components/account-settings/hooks/useUploadProfileImg';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { useAuth } from 'hooks';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingSpinner } from 'components/common';
import type { IUpdateImageForm } from '../types';

export default function UpdateImageForm() {
  const { userInfo } = useAuth();
  const [imgPreview, setImgPreview] = useState(userInfo?.profile_image);
  const { register, handleSubmit, watch, reset } = useForm<IUpdateImageForm>({
    mode: 'onChange',
  });

  const updateImage = useUploadProfileImg();
  const imageInput = watch('profileImg');

  function onSubmit(data: IUpdateImageForm) {
    const image = data.profileImg[0];

    if (image) {
      updateImage.mutate(image);
    }
  }

  useEffect(() => {
    if (imageInput && imageInput[0]) {
      const image = URL.createObjectURL(imageInput[0]);
      setImgPreview(image);
    }
  }, [imageInput]);

  useEffect(() => {
    if (imageInput && imageInput[0]) {
      reset();
    }
  }, [updateImage.isSuccess]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="account-settings__image-form"
    >
      <h2>Profile image</h2>
      <div className="account-settings__image-form-wrapper">
        <img
          className="account-settings__form-user-img"
          src={imgPreview}
          alt=""
        />

        <label htmlFor="img" className="account-settings__form-img-label">
          New image
          <input
            id="img"
            className="account-settings__form-img-input"
            {...register('profileImg')}
            type="file"
            accept="image/png, image/jpg, image/jpeg"
          />
        </label>
      </div>

      {imageInput && imageInput[0] ? (
        <div className="account-settings__form-controllers">
          <button
            type="submit"
            className="account-settings__form-submit"
            disabled={updateImage.isLoading}
          >
            Submit new image
          </button>
        </div>
      ) : null}

      {updateImage.isError ? (
        <div className="account-settings__form-error" role="alert">
          <MdOutlineErrorOutline />
          <p>{updateImage.error.response.data.message}</p>
        </div>
      ) : null}

      {updateImage.isLoading ? (
        <div className="account-settings__form-loading">
          <LoadingSpinner />
        </div>
      ) : null}
    </form>
  );
}

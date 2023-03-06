/* eslint-disable react/jsx-props-no-spreading */
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { LoadingSpinner } from 'components/common/index';
import { BiImageAdd } from 'react-icons/bi';
import useNewPost from '../hooks/useNewPost';
import type { IFormInputs } from '../types';
import UploadedImage from './UploadedImage';

interface IProps {
  queryKey: string;
}

export default function NewPostForm({ queryKey }: IProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
    control,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm<IFormInputs>({ mode: 'onChange' });
  const imagesInput = watch('images');
  const newPostMutation = useNewPost(queryKey);
  function onSubmit(formInputs: IFormInputs) {
    if (formInputs.images && formInputs.images?.length > 3) {
      return setError('images', {
        type: 'maxLength',
        message: 'only can submit 3 images maximum per post',
      });
    }
    return newPostMutation.mutate(formInputs);
  }

  function handleFileInputClick() {
    fileInputRef.current?.click();
  }

  function handleFileRemove(name?: string, size?: number) {
    if (!imagesInput) return;
    const filteredFiles = [...imagesInput].filter(
      (file) => file.name !== name && file.size !== size
    );

    const newFileList = new DataTransfer();
    filteredFiles.map((element) => newFileList.items.add(element));
    setValue('images', newFileList.files);
  }

  useEffect(() => {
    if (newPostMutation.isSuccess) {
      reset();
    }
  }, [newPostMutation.isSuccess, reset]);

  useEffect(() => {
    if (!imagesInput) return;

    if (imagesInput.length > 3) {
      setError('images', {
        type: 'maxLength',
        message: 'only can submit 3 images maximum per post',
      });
    }

    if (imagesInput.length <= 3) {
      clearErrors('images');
    }
  }, [imagesInput?.length]);

  return (
    <form
      className="new-post-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <textarea
        className="new-post-form__text-input"
        aria-labelledby="new-post-error"
        aria-invalid={errors.text ? 'true' : 'false'}
        placeholder="Write your new post"
        {...register('text', { required: "can't create an empty post" })}
      />

      {imagesInput ? (
        <div className="new-post-form__uploaded-images">
          {Array.from(imagesInput).map((file) => (
            <UploadedImage
              key={file.name}
              file={file}
              onFileRemove={(name, size) => handleFileRemove(name, size)}
            />
          ))}
        </div>
      ) : null}

      {errors.text ? (
        <p className="new-post-form__error-message" id="new-post-error">
          {errors.text.message}
        </p>
      ) : null}

      {errors.images ? (
        <p className="new-post-form__error-message" id="new-post-error">
          {errors.images.message}
        </p>
      ) : null}

      <div className="new-post-form__controllers">
        <button
          type="submit"
          className="new-post-form__submit"
          disabled={newPostMutation.isLoading}
          value={undefined}
        >
          Create new post
        </button>

        <button
          type="button"
          aria-label="add images"
          className="new-post-form__add-image"
          onClick={handleFileInputClick}
        >
          <BiImageAdd />
        </button>

        <Controller
          name="images"
          control={control}
          render={() => (
            <input
              ref={(e) => {
                fileInputRef.current = e;
              }}
              multiple
              type="file"
              className="hidden"
              onChange={(e) => setValue('images', e.target.files)}
              accept="image/png, image/jpg, image/jpeg"
            />
          )}
        />

        {newPostMutation.isLoading ? (
          <div className="new-post-form__loading-spinner">
            <LoadingSpinner />
          </div>
        ) : null}
      </div>

      {newPostMutation.isError ? (
        <div role="alert">
          {newPostMutation.error.response.data?.errors?.map((error) => (
            <p key={error.msg} className="new-post-form__error-message">
              {error.msg}
            </p>
          ))}

          <p className="new-post-form__error-message">
            {newPostMutation.error.response.data.message}
          </p>
        </div>
      ) : null}
    </form>
  );
}

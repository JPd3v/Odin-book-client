/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { LoadingSpinner } from 'components/common/index';
import useNewPost from '../hooks/useNewPost';
import type { IFormInputs } from '../types';

export default function NewPostForm() {
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IFormInputs>({ mode: 'onChange' });

  const newPostMutation = useNewPost();

  function onSubmit(formInputs: IFormInputs) {
    newPostMutation.mutate(formInputs);
  }

  useEffect(() => {
    if (newPostMutation.isSuccess) {
      reset();
    }
  }, [newPostMutation.isSuccess, reset]);

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

      {errors.text ? (
        <p className="new-post-form__error-message" id="new-post-error">
          {errors.text.message}
        </p>
      ) : null}

      <div className="new-post-form__controllers">
        <button
          type="submit"
          className="new-post-form__submit"
          disabled={newPostMutation.isLoading}
        >
          Create new post
        </button>
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

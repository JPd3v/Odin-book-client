/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useNewPost from '../hooks/useNewPost';

interface IFormInputs {
  text: string;
}

export type { IFormInputs };

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

      <div className="new-post-form__controllers">
        {errors.text ? (
          <p className="new-post-form__error-message" id="new-post-error">
            {errors.text.message}
          </p>
        ) : null}

        <button
          type="submit"
          className="new-post-form__submit"
          disabled={newPostMutation.isLoading}
        >
          Create new post
        </button>

        {newPostMutation.isLoading ? (
          <div>
            <p>loading spinner placeholder</p>
          </div>
        ) : null}
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
      </div>
    </form>
  );
}

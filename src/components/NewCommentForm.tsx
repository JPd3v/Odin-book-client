/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useNewComment from '../hooks/useNewComment';

interface IProps {
  postId: string;
}

interface IFormInputs {
  text: string;
}

export type { IFormInputs };

export default function NewCommentForm({ postId }: IProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({ mode: 'onChange' });

  const createNewComment = useNewComment();

  const FORM_UUID = crypto.randomUUID();

  function onSubmit(formInputs: IFormInputs) {
    createNewComment.mutate({ formInputs, postId });
  }

  useEffect(() => {
    if (createNewComment.isSuccess) {
      reset();
    }
  }, [createNewComment.isSuccess, reset]);

  return (
    <form className="comment-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <textarea
        aria-labelledby={`comment-error${FORM_UUID}`}
        aria-invalid={errors.text ? 'true' : 'false'}
        className="comment-form__text-input"
        placeholder="write a comment"
        {...register('text', {
          required: 'cant send an empty comment',
        })}
      />
      <div className="comment-form__controllers">
        <button
          disabled={createNewComment.isLoading}
          type="submit"
          className="comment-form__submit"
        >
          Submit
        </button>
        {errors.text ? (
          <p
            className="comment-form__error-message"
            id={`comment-error${FORM_UUID}`}
          >
            {errors.text?.message}
          </p>
        ) : null}

        {createNewComment.isLoading ? <p>loading spinner placeholder</p> : null}

        {createNewComment.isError ? (
          <div role="alert">
            {createNewComment.error.response.data.errors?.map((error) => (
              <p key={error.msg} className="comment-form__error-message">
                {error.msg}
              </p>
            ))}
            <p className="comment-form__error-message">
              {createNewComment.error.response.data?.message}
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}

/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingSpinner } from 'components/common/index';
import useNewReply from '../hooks/useNewReply';

interface IFormInputs {
  replyText: string;
}

interface Iprops {
  commentId: string;
}

export default function NewReplyForm({ commentId }: Iprops) {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({ mode: 'onChange' });

  const newReplyMutation = useNewReply();

  const REPLY_UUID = crypto.randomUUID();

  function onSubmit(formInputs: IFormInputs) {
    const { replyText } = formInputs;
    newReplyMutation.mutate({ reply_text: replyText, commentId });
  }

  useEffect(() => {
    if (newReplyMutation.isSuccess) {
      reset();
    }
  }, [newReplyMutation.isSuccess, reset]);

  return (
    <form className="reply-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <textarea
        aria-labelledby={`reply-error${REPLY_UUID}`}
        aria-invalid={errors.replyText ? 'true' : 'false'}
        className="reply-form__text-input"
        placeholder="Write your reply"
        {...register('replyText', { required: "can't send an empty reply" })}
      />

      <div className="reply-form__controllers">
        <button
          className="reply-form__submit"
          type="submit"
          disabled={newReplyMutation.isLoading}
        >
          Submit
        </button>

        <p
          className="reply-form__error-message"
          id={`reply-error${REPLY_UUID}`}
        >
          {errors.replyText?.message}
        </p>

        {newReplyMutation.isError ? (
          <div role="alert">
            {newReplyMutation.error.response.data.errors?.map((error) => (
              <p className="reply-form__error-message" key={error.msg}>
                {error.msg}
              </p>
            ))}

            <p className="reply-form__error-message">
              {newReplyMutation.error.response.data.message}
            </p>
          </div>
        ) : null}

        {newReplyMutation.isLoading ? (
          <div className="reply-form__loading-spinner">
            <LoadingSpinner />
          </div>
        ) : null}
      </div>
    </form>
  );
}

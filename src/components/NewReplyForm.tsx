/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';

interface IFormInputs {
  reply_text: string;
}

interface Iprops {
  commentId: string;
}

export default function NewReplyForm({ commentId }: Iprops) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({ mode: 'onChange' });

  const REPLY_UUID = crypto.randomUUID();

  function onSubmit(formInputs: IFormInputs) {
    console.log(formInputs);
    console.log(commentId);
  }

  return (
    <form className="reply-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <textarea
        aria-labelledby={`reply-error${REPLY_UUID}`}
        aria-invalid={errors.reply_text ? 'true' : 'false'}
        className="reply-form__text-input"
        placeholder="Write your reply"
        {...register('reply_text', { required: "can't send an empty reply" })}
      />
      <div className="reply-form__controllers">
        <button className="reply-form__submit" type="submit">
          Submit
        </button>
        <p
          className="reply-form__error-message"
          id={`reply-error${REPLY_UUID}`}
        >
          {errors.reply_text?.message}
        </p>
      </div>
    </form>
  );
}

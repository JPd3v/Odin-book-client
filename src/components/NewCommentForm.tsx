/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';

interface IFormInputs {
  text: string;
}

export default function NewCommentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({ mode: 'onChange' });

  const FORM_UUID = crypto.randomUUID();

  function onSubmit(formData: IFormInputs) {
    console.log(formData);
  }
  return (
    <form className="comment-form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <textarea
        aria-labelledby={`comment-error ${FORM_UUID}`}
        aria-invalid={errors.text ? 'true' : 'false'}
        className="comment-form__text-input"
        placeholder="write a comment"
        {...register('text', {
          required: 'cant send an empty comment',
        })}
      />
      <div className="comment-form__controllers">
        <button type="submit" className="comment-form__submit">
          Submit
        </button>
        <p
          className="comment-form__error-message"
          id={`comment-error ${FORM_UUID}`}
        >
          {errors.text?.message}
        </p>
      </div>
    </form>
  );
}

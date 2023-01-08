/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';

interface IFormInputs {
  text: string;
}

export default function NewPostForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({ mode: 'onChange' });

  function onSubmit(formInputs: IFormInputs) {
    console.log(formInputs);
  }

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

        <button type="submit" className="new-post-form__submit">
          Create new post
        </button>
      </div>
    </form>
  );
}

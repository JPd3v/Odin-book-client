/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';

interface IFormInputs {
  username: string;
  password: string;
}

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function LogInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({ mode: 'onChange' });

  function onSubmit(formInputs: IFormInputs) {
    console.log(formInputs);
  }

  return (
    <form className="log-in-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="log-in-form__title">Log in</h2>
      <label htmlFor="email" className="log-in-form__label">
        Email
        <input
          type="email"
          aria-invalid={errors.username ? 'true' : 'false'}
          aria-labelledby="email-error"
          {...register('username', {
            required: 'Email is required',
            pattern: {
              value: emailRegex,
              message:
                'Email introduced is not valid. e.g: example@example.com',
            },
          })}
          id="email"
        />
      </label>

      {errors.username ? (
        <p className="log-in-form__error" id="email-error">
          {errors.username.message}
        </p>
      ) : null}

      <label htmlFor="password" className="log-in-form__label">
        Password
        <input
          type="password"
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-labelledby="password-error"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password needs to be at least 8 characters long',
            },
          })}
          id="password"
        />
      </label>

      {errors.password ? (
        <p className="log-in-form__error" id="password-error">
          {errors.password.message}
        </p>
      ) : null}

      <button type="submit" className="log-in-form__submit">
        Log in
      </button>
    </form>
  );
}

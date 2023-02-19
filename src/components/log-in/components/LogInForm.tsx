/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import { LoadingSpinner } from 'components/common/index';
import useLogIn from '../hooks/useLogIn';
import useLogInAsGuest from '../hooks/useLogInAsGuest';
import type { IFormInputs } from '../types';

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function LogInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({ mode: 'onChange' });

  const logInMutation = useLogIn();
  const logInAsGuest = useLogInAsGuest();

  function onSubmit(formInputs: IFormInputs) {
    logInMutation.mutate(formInputs);
  }

  function handlelogInAsGuest() {
    logInAsGuest.mutate('');
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

      {logInMutation.isLoading ? (
        <div className="log-in-form__loading-spinner">
          <LoadingSpinner />
        </div>
      ) : null}

      {logInMutation.isError ? (
        <div className="log-in-form__server-error">
          {logInMutation.error.response.status === 422 ? (
            logInMutation.error.response.data.errors?.map((error) => (
              <p key={error.msg} className="log-in-form__error" role="alert">
                {error.msg}
              </p>
            ))
          ) : (
            <p className="log-in-form__error" role="alert">
              {logInMutation.error.response.data.message}
            </p>
          )}
        </div>
      ) : null}

      <div className="log-in-form__socials">
        <a
          href={`${import.meta.env.VITE_BASE_URL}/oauth/auth/facebook`}
          className="log-in-form__socials-facebook"
        >
          log in with facebook
        </a>
        <button
          type="button"
          className="log-in-form__socials-guest"
          onClick={handlelogInAsGuest}
        >
          log in as a guest
        </button>
      </div>

      <button
        type="submit"
        className="log-in-form__submit"
        disabled={logInMutation.isLoading}
      >
        Log in
      </button>
    </form>
  );
}

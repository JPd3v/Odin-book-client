/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import differenceInYears from 'date-fns/differenceInYears';

enum GenderEnum {
  female = 'female',
  male = 'male',
  other = 'other',
}

interface IFormInputs {
  first_name: string;
  last_name: string;
  gender: GenderEnum;
  birthday: string;
  username: string;
  password: string;
  confirm_password: string;
}

const todayDate = new Date();

export default function SignUpForm() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();

  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const password = watch('password');
  function onSubmit(data: IFormInputs) {
    console.log(data);
  }
  return (
    <main className="sign-up-page">
      <form
        className="sign-up-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <h2>Sign up</h2>

        <label htmlFor="first-name" className="sign-up-form__label">
          First name
          <input
            type="text"
            aria-labelledby="first-name-error"
            aria-invalid={errors.first_name ? 'true' : 'false'}
            {...register('first_name', {
              required: 'First name is required',
              maxLength: {
                value: 15,
                message:
                  'Your first name exceeds the maximum length of 15 characters',
              },
            })}
            id="first-name"
          />
        </label>
        {errors.first_name ? (
          <p className="sign-up-form__error" id="first-name-error">
            {errors.first_name?.message}
          </p>
        ) : null}

        <label htmlFor="last-name" className="sign-up-form__label">
          Last name
          <input
            aria-labelledby="last-name-error"
            aria-invalid={errors.last_name ? 'true' : 'false'}
            type="text"
            {...register('last_name', {
              required: 'Last name is required',
              maxLength: {
                value: 15,
                message:
                  'Your last name exceeds the maximum length of 15 characters',
              },
            })}
            id="last-name"
          />
        </label>

        {errors.last_name ? (
          <p className="sign-up-form__error" id="last-name-error">
            {errors.last_name?.message}
          </p>
        ) : null}

        <label htmlFor="gender" className="sign-up-form__label">
          Gender
          <select {...register('gender')} id="gender">
            <option value="female">female</option>
            <option value="male">male</option>
            <option value="other">other</option>
          </select>
        </label>

        <label htmlFor="birthday" className="sign-up-form__label">
          Birthday
          <input
            type="date"
            aria-labelledby="birthday-error"
            aria-invalid={errors.birthday ? 'true' : 'false'}
            {...register('birthday', {
              required: 'Birthday is required',
              validate: {
                great: (value) =>
                  differenceInYears(todayDate, new Date(value)) >= 18 ||
                  'You are to young to sign up in this site, come later',
              },
            })}
            id="birthday"
          />
        </label>

        {errors.birthday ? (
          <p className="sign-up-form__error" id="birthday-error">
            {errors.birthday?.message}
          </p>
        ) : null}

        <label htmlFor="email" className="sign-up-form__label">
          Email
          <input
            type="email"
            aria-invalid={errors.username ? 'true' : 'false'}
            aria-describedby="e-mail-error"
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
          <p className="sign-up-form__error" id="e-mail-error">
            {errors.username?.message}
          </p>
        ) : null}

        <label htmlFor="password" className="sign-up-form__label">
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
          <p className="sign-up-form__error" id="password-error">
            {errors.password.message}
          </p>
        ) : null}

        <label htmlFor="confirm_password" className="sign-up-form__label">
          Confirm password
          <input
            type="password"
            aria-invalid={errors.confirm_password ? 'true' : 'false'}
            aria-labelledby="confirm-password-error"
            {...register('confirm_password', {
              required: 'Confirm password is required',
              validate: {
                areEqual: (value) =>
                  value === password ||
                  'Password and Confirm password fields should match',
              },
            })}
            id="confirm_password"
          />
        </label>

        {errors.confirm_password ? (
          <p className="sign-up-form__error" id="confirm-password-error">
            {errors.confirm_password.message}
          </p>
        ) : null}

        <button type="submit" className="sign-up-form__submit">
          Sign Up
        </button>
      </form>
    </main>
  );
}

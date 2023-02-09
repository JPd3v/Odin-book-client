/* eslint-disable react/jsx-props-no-spreading */
import { useAuth } from 'hooks';
import { useForm } from 'react-hook-form';
import { MdOutlineErrorOutline } from 'react-icons/md';
import differenceInYears from 'date-fns/differenceInYears';
import { useEffect } from 'react';
import { LoadingSpinner } from 'components/common/index';
import useUpdateUserInfo from '../hooks/useUpdateUserInfo';
import type { IUserDetailsForm } from '../types';

const todayDate = new Date();

export default function UpdateUserInfoForm() {
  const { userInfo } = useAuth();
  const {
    register,
    watch,
    handleSubmit,
    resetField,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<IUserDetailsForm>({
    mode: 'onChange',
    defaultValues: {
      first_name: userInfo?.first_name,
      last_name: userInfo?.last_name,
      gender: userInfo?.gender,
      birthday: userInfo?.birthday,
      currentUsername: userInfo?.email,
      username: '',
      confirmUsername: '',
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  });
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const username = watch('username');
  const oldPassword = watch('oldPassword');
  const password = watch('password');

  const updateUser = useUpdateUserInfo();
  useEffect(() => {
    if (oldPassword.length === 0) {
      resetField('password');
      resetField('confirmPassword');
    }
  }, [oldPassword]);

  useEffect(() => {
    reset({
      first_name: userInfo?.first_name,
      last_name: userInfo?.last_name,
      gender: userInfo?.gender,
      birthday: userInfo?.birthday,
      currentUsername: userInfo?.email,
      username: '',
      confirmUsername: '',
      oldPassword: '',
      password: '',
      confirmPassword: '',
    });
  }, [updateUser.isSuccess]);
  function onSubmit(formInputs: IUserDetailsForm) {
    const modifiedInputs = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        formInputs[key as keyof IUserDetailsForm],
      ])
    );
    updateUser.mutate(modifiedInputs);
  }

  return (
    <form
      className="update-user-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <h2 className="update-user-form__title">Account Details</h2>
      <div className="update-user__inputs">
        <div className="update-user__inputs-top">
          <div className="update-user__input-wrapper">
            <label htmlFor="first-name" className="update-user-form__label">
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
              <p className="update-user-form__error" id="first-name-error">
                {errors.first_name?.message}
              </p>
            ) : null}
          </div>

          <div className="update-user__input-wrapper">
            <label htmlFor="last-name" className="update-user-form__label">
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
              <p className="update-user-form__error" id="last-name-error">
                {errors.last_name?.message}
              </p>
            ) : null}
          </div>

          <div className="update-user__input-wrapper">
            <label htmlFor="gender" className="update-user-form__label">
              Gender
              <select {...register('gender')} id="gender">
                <option value="other">other</option>
                <option value="female">female</option>
                <option value="male">male</option>
              </select>
            </label>
          </div>

          <div className="update-user__input-wrapper">
            <label htmlFor="birthday" className="update-user-form__label">
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
                      'You need to be at least 18 years old.',
                  },
                })}
                id="birthday"
              />
            </label>

            {errors.birthday ? (
              <p className="update-user-form__error" id="birthday-error">
                {errors.birthday.message}
              </p>
            ) : null}
          </div>
        </div>
        <div className="update-user__inputs-bottom">
          <fieldset className="update-user-form__fieldset">
            <legend>Change email</legend>
            <label htmlFor="email" className="update-user-form__label">
              Current email
              <input
                type="email"
                id="email"
                disabled
                {...register('currentUsername')}
              />
            </label>

            <label htmlFor="new-email" className="update-user-form__label">
              New email
              <input
                type="email"
                aria-invalid={errors.username ? 'true' : 'false'}
                aria-labelledby="new-email-error"
                {...register('username', {
                  pattern: {
                    value: emailRegex,
                    message:
                      'Email introduced is not valid. e.g: example@example.com',
                  },
                })}
                id="new-email"
              />
            </label>

            {errors.username ? (
              <p className="update-user-form__error" id="new-email-error">
                {errors.username.message}
              </p>
            ) : null}

            <label
              htmlFor="confirm-new-email"
              className="update-user-form__label"
            >
              Confirm new email
              <input
                type="email"
                aria-invalid={errors.confirmUsername ? 'true' : 'false'}
                aria-labelledby="confirm-new-email"
                {...register('confirmUsername', {
                  validate: {
                    areEqual: (value) => {
                      if (username) {
                        return (
                          value === username ||
                          'New email and Confirm new email fields should match'
                        );
                      }
                      return true;
                    },
                  },
                })}
                id="confirm-new-email"
              />
            </label>

            {errors.confirmUsername ? (
              <p
                className="update-user-form__error"
                id="confirm-password-error"
              >
                {errors.confirmUsername.message}
              </p>
            ) : null}
          </fieldset>

          <fieldset className="update-user-form__fieldset">
            <legend>Change password</legend>

            <label
              htmlFor="current-password"
              className="update-user-form__label"
            >
              Current password
              <input
                type="password"
                aria-invalid={errors.oldPassword ? 'true' : 'false'}
                aria-labelledby="current-password-error"
                {...register('oldPassword', {
                  minLength: {
                    value: 8,
                    message: 'Password should be at least 8 characters long',
                  },
                })}
                id="current-password"
              />
            </label>

            {errors.oldPassword ? (
              <p
                className="update-user-form__error"
                id="current-password-error"
              >
                {errors.oldPassword.message}
              </p>
            ) : null}

            {oldPassword ? (
              <>
                <label
                  htmlFor="new-password"
                  className="update-user-form__label"
                >
                  New password
                  <input
                    type="password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-labelledby="new-password-error"
                    {...register('password', {
                      minLength: {
                        value: 8,
                        message:
                          'Password needs to be at least 8 characters long',
                      },
                    })}
                    id="new-password"
                  />
                </label>

                {errors.password ? (
                  <p
                    className="update-user-form__error"
                    id="new-password-error"
                  >
                    {errors.password.message}
                  </p>
                ) : null}

                <label
                  htmlFor="confirm-new-password"
                  className="update-user-form__label"
                >
                  Confirm new password
                  <input
                    type="password"
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    aria-labelledby="confirm-new-password"
                    {...register('confirmPassword', {
                      validate: {
                        areEqual: (value) => {
                          if (password) {
                            return (
                              value === password ||
                              'New password and Confirm password fields should match'
                            );
                          }
                          return true;
                        },
                      },
                    })}
                    id="confirm-new-password"
                  />
                </label>

                {errors.confirmPassword ? (
                  <p
                    className="update-user-form__error"
                    id="confirm-password-error"
                  >
                    {errors.confirmPassword.message}
                  </p>
                ) : null}
              </>
            ) : null}
          </fieldset>
        </div>

        {updateUser.isLoading ? (
          <div className="update-user-form__loading-spinner">
            <LoadingSpinner />
          </div>
        ) : null}

        {updateUser.isError ? (
          <div className="update-user-form__server-errors" role="alert">
            {updateUser.error.response.data.errors?.map((error) => (
              <div className="update-user-form__server-error">
                <MdOutlineErrorOutline />
                <p key={error.msg}>{error.msg}</p>
              </div>
            ))}

            {updateUser.error.response.data.message ? (
              <div className="update-user-form__server-error">
                <MdOutlineErrorOutline />
                <p>{updateUser.error.response.data.message}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {isDirty && !updateUser.isLoading ? (
        <button type="submit" className="update-user-form__submit">
          Save Changes
        </button>
      ) : null}
    </form>
  );
}

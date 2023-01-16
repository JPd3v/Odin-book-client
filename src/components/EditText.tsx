/* eslint-disable react/jsx-props-no-spreading */
import { UseMutationResult } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { IFormData, IAxiosErrors } from '../hooks/useEditPost';
import LoadingSpinner from './LoadingSpinner';

interface IProps {
  text: string;
  id: string;
  toggleEditState: () => void;
  mutation: UseMutationResult<any, IAxiosErrors, IFormData, unknown>;
}

export default function EditText({
  text,
  toggleEditState,

  mutation,
  id,
}: IProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IProps>({
    mode: 'onChange',
    defaultValues: {
      text,
    },
  });
  const watchText = watch('text');

  function onSubmit(formInput: IProps) {
    const mutationObj = {
      text: formInput.text,
      id,
    };
    mutation.mutate(mutationObj);
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      toggleEditState();
    }
  }, [mutation.isSuccess, toggleEditState]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
      <textarea
        className="edit-form__input"
        {...register('text', { required: "can't save an empty post" })}
      />
      {errors.text ? (
        <p className="edit-form__error">{errors.text.message}</p>
      ) : null}
      <div className="edit-form__buttons">
        <button
          type="button"
          onClick={toggleEditState}
          className="edit-form__cancel"
        >
          cancel
        </button>

        {watchText !== text ? (
          <button
            type="submit"
            className="edit-form__submit"
            disabled={mutation.isLoading}
          >
            submit
          </button>
        ) : null}

        {mutation.isLoading ? (
          <div className="edit-form__loading-spinner">
            <LoadingSpinner />
          </div>
        ) : null}
      </div>
      {mutation.error ? (
        <div className="edit-form__error" role="alert">
          {mutation.error.response.data?.errors?.map((error) => (
            <p>{error.msg}</p>
          ))}

          <p>{mutation.error.response.data?.message}</p>
        </div>
      ) : null}
    </form>
  );
}

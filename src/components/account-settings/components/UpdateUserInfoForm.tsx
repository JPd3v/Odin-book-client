/* eslint-disable react/jsx-props-no-spreading */
import { useForm } from 'react-hook-form';
import { useAuth } from 'hooks';

export default function UpdateUserInfoForm() {
  return (
    <form>
      <label htmlFor="first-name">
        first name
        <input id="first-name" />
      </label>

      <label htmlFor="last-name">
        last name
        <input id="last-name" />
      </label>
    </form>
  );
}

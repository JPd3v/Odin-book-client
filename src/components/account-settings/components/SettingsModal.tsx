import ReactFocusLock from 'react-focus-lock';
import { AiOutlineClose } from 'react-icons/ai';
import UpdateImageForm from './UpdateImageForm';
import UpdateUserInfoForm from './UpdateUserInfoForm';

interface IProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: IProps) {
  return (
    <ReactFocusLock>
      <div className="account-settings-modal">
        <div className="account-settings__forms">
          <button
            type="button"
            aria-label="close account settings"
            className="account-settings__close-btn"
            onClick={onClose}
          >
            <AiOutlineClose />
          </button>

          <UpdateImageForm />
          <UpdateUserInfoForm />
        </div>
      </div>
    </ReactFocusLock>
  );
}

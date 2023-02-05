import ReactFocusLock from 'react-focus-lock';
import UpdateImageForm from './UpdateImageForm';
import UpdateUserInfoForm from './UpdateUserInfoForm';
// import  from "react-focus-lock"
export default function SettingsModal() {
  return (
    <ReactFocusLock>
      <div className="account-settings-modal">
        <div className="account-settings__forms">
          <UpdateImageForm />
          <UpdateUserInfoForm />
        </div>
      </div>
    </ReactFocusLock>
  );
}

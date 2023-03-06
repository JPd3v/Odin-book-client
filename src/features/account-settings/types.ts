interface IUpdateImageForm {
  profileImg: File[];
}

interface IUserDetailsForm {
  first_name: string;
  last_name: string;
  gender: GenderEnum | string;
  birthday: string;
  currentUsername: string;
  username: string;
  confirmUsername: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

enum GenderEnum {
  female = 'female',
  male = 'male',
  other = 'other',
}

export type { IUpdateImageForm, IUserDetailsForm };

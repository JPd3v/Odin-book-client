interface IFormInputs {
  first_name: string;
  last_name: string;
  gender: GenderEnum;
  birthday: string;
  username: string;
  password: string;
  confirm_password: string;
}

enum GenderEnum {
  female = 'female',
  male = 'male',
  other = 'other',
}
export type { IFormInputs, GenderEnum };

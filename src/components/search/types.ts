import { IUser } from 'types/index';

interface Isearch {
  firstName: string;
  lastName: string;
}

interface IPage {
  users: IUser[];
}

interface ISearchInput {
  text: string;
}

export type { Isearch, IPage, ISearchInput };

import { IPost } from 'types/index';

interface IAxiosDefaultErrors {
  response: IErrorResponse;
}

interface IErrorResponse {
  status: number;
  data: IresponseData;
}

interface IresponseData {
  message?: string;
  errors?: [{ msg: string }];
}

interface IFormInputs {
  text: string;
  images: FileList | null;
}

interface InfiniteData {
  pages: IPage[] | undefined;
}

interface IPage {
  posts: IPost[];
}

export type { IAxiosDefaultErrors, IFormInputs, InfiniteData };

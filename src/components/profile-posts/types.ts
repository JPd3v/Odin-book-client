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
}

interface InfiniteData {
  pages: IPage[] | undefined;
}

interface IPage {
  posts: IPost[];
}

interface InfiniteDatacontext {
  previousPosts: InfiniteData | undefined;
}

export type {
  IAxiosDefaultErrors,
  IFormInputs,
  InfiniteData,
  InfiniteDatacontext,
};

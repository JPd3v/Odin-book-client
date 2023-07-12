import { InfiniteData } from '@tanstack/react-query';

interface IPost {
  _id: string;
  creator: IUser;
  content: IContent;
  edited: boolean;
  likesCount: number;
  commentCount: number;
  timestamp: string;
  isLikedByUser: boolean;
}

interface IContent {
  text: string;
  images: Images[];
}

interface Images {
  public_id: string;
  img: string;
}

interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  profile_image: { img: string };
}

interface IComment {
  _id: string;
  post_id: string;
  content: IContent;
  creator: IUser;
  edited: boolean;
  timestamp: string;
  likesCount: number;
  repliesCount: number;
  isLikedByUser: boolean;
}

interface IReply {
  _id: string;
  comment_id: string;
  creator: IUser;
  content: IContent;
  post_id: string;
  edited: boolean;
  timestamp: string;
  likesCount: number;
  isLikedByUser: boolean;
}

interface IAxiosDefaultErrors {
  response: IErrorResponse;
}

interface IErrorResponse {
  status: number;
  data: IErrorresponseData;
}

interface IErrorresponseData {
  message?: string;
  errors?: [{ msg: string }];
}

type InfiniteComments = InfiniteData<{ comments: IComment[] }>;

export type {
  IPost,
  IComment,
  IReply,
  IUser,
  IAxiosDefaultErrors,
  InfiniteComments,
};

interface IPost {
  _id: string;
  creator: IUser;
  content: IContent;
  edited: boolean;
  likes: string[];
  comments: IComment[];
  timestamp: string;
}

interface IContent {
  text: string;
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
  likes: string[];
  timestamp: string;
  replies: IReply[];
}

interface IReply {
  _id: string;
  comment_id: string;
  creator: IUser;
  content: IContent;
  likes: string[];
  post_id: string;
  edited: boolean;
  timestamp: string;
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

export type { IPost, IComment, IReply, IUser, IAxiosDefaultErrors };

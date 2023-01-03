import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { AiOutlineLike, AiOutlineLink } from 'react-icons/ai';
import formatDistance from 'date-fns/formatDistance';
import { Link } from 'react-router-dom';
import PostComments from './PostComments';

interface IProps {
  userPost: IUserPost;
}

interface IUserPost {
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
  replies: Ireplies[];
}

interface Ireplies {
  _id: string;
  creator: IUser;
  content: IContent;
  likes: string[];
  post_id: string;
  edited: boolean;
  timestamp: string;
}

export type { IUserPost, IComment };

export default (function UserPost({ userPost }: IProps) {
  const { _id, content, creator, edited, likes, timestamp, comments } =
    userPost;

  const [showComments, setShowComments] = useState(true);

  const formater = Intl.NumberFormat('en', { notation: 'compact' });

  const likesCount = formater.format(likes.length);
  const commentsCount = formater.format(comments.length);

  const posttDate = new Date(timestamp);
  const postDateFormated = formatDistance(posttDate, Date.now());

  return (
    <article className="post">
      <div className="post__header">
        <Link to={`users/${creator._id}`}>
          <img
            className="post__creator-img"
            src={`${creator.profile_image.img}`}
            alt=""
            aria-label={`${creator.first_name} ${creator.last_name}`}
          />
        </Link>

        <div className="post__header-right">
          <h2 className="post__creator-name">
            <Link to={`users/${creator._id}`}>
              {`${creator.first_name} ${creator.last_name}`}
            </Link>
          </h2>
          <Link
            to={`posts/${_id}`}
            className="post__info"
          >{`${postDateFormated} ${edited ? '(edited)' : ''}`}</Link>
        </div>
      </div>
      <p className="post__content">{content.text}</p>

      <div className="post__controllers">
        <button type="button">
          {/* IMPORTANT ADD CONDINITONAL ARIA LABEL RENDERING IF THE POST IS LIKED OR NOT */}
          <AiOutlineLike aria-label="Give like" /> {likesCount}
        </button>
        <button type="button" onClick={() => setShowComments((prev) => !prev)}>
          <BiCommentDetail
            aria-label={`${
              showComments ? 'close comment section' : 'open comment section'
            }`}
          />
          {commentsCount}
        </button>
        <button type="button">
          <AiOutlineLink />
          Copy Link
        </button>
      </div>
      {showComments ? <PostComments comments={comments} /> : null}
    </article>
  );
});

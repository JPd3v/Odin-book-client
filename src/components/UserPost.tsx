import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { AiFillLike, AiOutlineLike, AiOutlineLink } from 'react-icons/ai';
import formatDistance from 'date-fns/formatDistance';
import { Link } from 'react-router-dom';
import PostComments from './PostComments';
import CommentQuantityLimiter from './CommentQuantityLimiter';
import useAuth from '../hooks/useAuth';
import useIdIsOnArray from '../hooks/useIdIsOnArray';
import usePostLike from '../hooks/usePostLike';
import DotsDropdown from './DotsDropdown';
import useDeletePost from '../hooks/useDeletePost';
import EditText from './EditText';
import useEditPost from '../hooks/useEditPost';

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
  comment_id: string;
  creator: IUser;
  content: IContent;
  likes: string[];
  post_id: string;
  edited: boolean;
  timestamp: string;
}

export type { IUserPost, IComment, Ireplies };

export default (function UserPost({ userPost }: IProps) {
  const { _id, content, creator, edited, likes, timestamp, comments } =
    userPost;

  const [showComments, setShowComments] = useState(false);
  const [commentsLimit, setCommentsLimit] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useAuth();

  const likeMutation = usePostLike();
  const deletePostMutation = useDeletePost();
  const editPostMutation = useEditPost();

  const postComments = comments.slice(0, commentsLimit).reverse();

  function handleIncrement(increment: number) {
    if (commentsLimit + increment < comments.length) {
      return setCommentsLimit((prev) => prev + increment);
    }
    return setCommentsLimit(comments.length);
  }

  function handlePostDelete() {
    deletePostMutation.mutate(_id);
  }

  function handleEditState() {
    setIsEditing((prev) => !prev);
  }

  const userLikeThisPost = useIdIsOnArray(userPost.likes, userInfo?._id);

  const formater = Intl.NumberFormat('en', { notation: 'compact' });

  const likesCount = formater.format(likes.length);
  const commentsCount = formater.format(comments.length);

  const posttDate = new Date(timestamp);
  const postDateFormated = formatDistance(posttDate, Date.now());

  return (
    <article className="post">
      {creator._id === userInfo?._id ? (
        <div className="post__dots-button">
          <DotsDropdown
            onDelete={() => handlePostDelete()}
            onEdit={() => handleEditState()}
          />
        </div>
      ) : null}

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

      {isEditing ? (
        <EditText
          text={content.text}
          id={_id}
          toggleEditState={() => handleEditState()}
          mutation={editPostMutation}
        />
      ) : (
        <p className="post__content">{content.text}</p>
      )}

      <div className="post__controllers">
        {userLikeThisPost ? (
          <button
            type="button"
            className="post__controllers-like-button post__controllers-like-button--active"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(_id) : null
            }
          >
            <AiFillLike aria-label="Remove like" />
            <p>{likesCount}</p>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(_id) : null
            }
          >
            <AiOutlineLike aria-label="Give like" /> <p>{likesCount}</p>
          </button>
        )}

        <button type="button" onClick={() => setShowComments((prev) => !prev)}>
          <BiCommentDetail
            aria-label={`${
              showComments ? 'close comment section' : 'open comment section'
            }`}
          />
          <p>{commentsCount}</p>
        </button>
        <button type="button">
          <AiOutlineLink />
          Copy Link
        </button>
      </div>
      {showComments && comments.length ? (
        <CommentQuantityLimiter
          commentsLength={comments.length}
          currentLimit={commentsLimit}
          handleIncrement={(increment) => handleIncrement(increment)}
        />
      ) : null}
      {showComments ? (
        <PostComments comments={postComments} postId={_id} />
      ) : null}
    </article>
  );
});

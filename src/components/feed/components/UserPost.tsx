import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import formatDistance from 'date-fns/formatDistance';
import { Link } from 'react-router-dom';
import {
  CommentQuantityLimiter,
  DotsDropdown,
  EditText,
} from 'components/common/index';
import { useAuth, useIdIsOnArray } from 'hooks/index';
import type { IPost } from 'types/index';
import usePostLike from '../hooks/usePostLike';
import useDeletePost from '../hooks/useDeletePost';
import useEditPost from '../hooks/useEditPost';
import PostComments from './PostComments';

interface IProps {
  userPost: IPost;
}

export default function UserPost({ userPost }: IProps) {
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
        <Link to={`/users/${creator._id}`}>
          <img
            className="post__creator-img"
            src={`${creator.profile_image.img}`}
            alt=""
            aria-label={`${creator.first_name} ${creator.last_name}`}
          />
        </Link>

        <div className="post__header-right">
          <h2 className="post__creator-name">
            <Link to={`/users/${creator._id}`}>
              {`${creator.first_name} ${creator.last_name}`}
            </Link>
          </h2>
          <Link
            to={`/posts/${_id}`}
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

      {content.images.length ? (
        <div className="post__content-images">
          {content.images.map((image) => (
            <img
              src={image.img}
              alt=""
              loading="lazy"
              key={image.public_id}
              className="post__content-image"
            />
          ))}
        </div>
      ) : null}

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
}

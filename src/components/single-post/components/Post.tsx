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
import PostComments from './CommentList';

interface IProps {
  post: IPost;
}

export default function UserPost({ post }: IProps) {
  const [showComments, setShowComments] = useState(true);
  const [commentsLimit, setCommentsLimit] = useState(50);
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useAuth();

  const likeMutation = usePostLike();
  const deletePostMutation = useDeletePost();
  const editPostMutation = useEditPost();

  const postComments = post.comments.slice(0, commentsLimit).reverse();

  function handleIncrement(increment: number) {
    if (commentsLimit + increment < post.comments.length) {
      return setCommentsLimit((prev) => prev + increment);
    }
    return setCommentsLimit(post.comments.length);
  }

  function handlePostDelete() {
    deletePostMutation.mutate(post._id);
  }

  function handleEditState() {
    setIsEditing((prev) => !prev);
  }

  const userLikeThisPost = useIdIsOnArray(post.likes, userInfo?._id);

  const formater = Intl.NumberFormat('en', { notation: 'compact' });

  const likesCount = formater.format(post.likes.length);
  const commentsCount = formater.format(post.comments.length);

  const posttDate = new Date(post.timestamp);
  const postDateFormated = formatDistance(posttDate, Date.now());

  return (
    <article className="single-post">
      {post.creator._id === userInfo?._id ? (
        <div className="post__dots-button">
          <DotsDropdown
            onDelete={() => handlePostDelete()}
            onEdit={() => handleEditState()}
          />
        </div>
      ) : null}

      <div className="post__header">
        <Link to={`/users/${post.creator._id}`}>
          <img
            className="post__creator-img"
            src={`${post.creator.profile_image.img}`}
            alt=""
            aria-label={`${post.creator.first_name} ${post.creator.last_name}`}
          />
        </Link>

        <div className="post__header-right">
          <h2 className="post__creator-name">
            <Link to={`/users/${post.creator._id}`}>
              {`${post.creator.first_name} ${post.creator.last_name}`}
            </Link>
          </h2>
          <Link
            to={`/posts/${post._id}`}
            className="post__info"
          >{`${postDateFormated} ${post.edited ? '(edited)' : ''}`}</Link>
        </div>
      </div>

      {isEditing ? (
        <EditText
          text={post.content.text}
          id={post._id}
          toggleEditState={() => handleEditState()}
          mutation={editPostMutation}
        />
      ) : (
        <p className="post__content">{post.content.text}</p>
      )}

      <div className="post__controllers">
        {userLikeThisPost ? (
          <button
            type="button"
            className="post__controllers-like-button post__controllers-like-button--active"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(post._id) : null
            }
          >
            <AiFillLike aria-label="Remove like" />
            <p>{likesCount}</p>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(post._id) : null
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
      {showComments && post.comments.length ? (
        <CommentQuantityLimiter
          commentsLength={post.comments.length}
          currentLimit={commentsLimit}
          handleIncrement={(increment) => handleIncrement(increment)}
        />
      ) : null}
      {showComments ? (
        <PostComments comments={postComments} postId={post._id} />
      ) : null}
    </article>
  );
}

import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import formatDistance from 'date-fns/formatDistance';
import { Link } from 'react-router-dom';
import { DotsDropdown, EditText } from 'components/common/index';
import { useAuth } from 'hooks/index';
import type { IPost } from 'types/index';
import { CommentList } from 'features/comments';
import usePostLike from '../hooks/usePostLike';
import useDeletePost from '../hooks/useDeletePost';
import useEditPost from '../hooks/useEditPost';

interface IProps {
  post: IPost;
}

export default function Post({ post }: IProps) {
  const {
    _id,
    content,
    creator,
    edited,
    timestamp,
    likesCount,
    commentCount,
    isLikedByUser,
  } = post;

  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useAuth();

  const likeMutation = usePostLike();
  const deletePostMutation = useDeletePost();
  const editPostMutation = useEditPost();

  function handlePostDelete() {
    deletePostMutation.mutate(post);
  }

  function handleEditState() {
    setIsEditing((prev) => !prev);
  }

  const formater = Intl.NumberFormat('en', { notation: 'compact' });

  const formatedLikesCount = formater.format(likesCount);
  const formatedCommentsCount = formater.format(commentCount);

  const postDate = new Date(timestamp);
  const postDateFormated = formatDistance(postDate, Date.now());

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
        {isLikedByUser ? (
          <button
            type="button"
            className="post__controllers-like-button post__controllers-like-button--active"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(post) : null
            }
          >
            <AiFillLike aria-label="Remove like" />
            <p>{formatedLikesCount}</p>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(post) : null
            }
          >
            <AiOutlineLike aria-label="Give like" /> <p>{formatedLikesCount}</p>
          </button>
        )}

        <button type="button" onClick={() => setShowComments((prev) => !prev)}>
          <BiCommentDetail
            aria-label={`${
              showComments ? 'close comment section' : 'open comment section'
            }`}
          />
          <p>{formatedCommentsCount}</p>
        </button>
      </div>
      {showComments ? (
        <CommentList commentsCount={commentCount} postId={_id} />
      ) : null}
    </article>
  );
}

import { Link } from 'react-router-dom';
import { useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { BsArrowReturnRight } from 'react-icons/bs';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { useAuth } from 'hooks/index';
import { EditText, DotsDropdown } from 'components/common/index';
import type { IComment } from 'types/index';
import Replies from '../../replies/components/Replies';
import useCommentLike from '../hooks/useCommentLike';
import useEditComment from '../hooks/useEditComment';
import useDeleteComment from '../hooks/useDeleteComment';

interface IProps {
  comment: IComment;
}

export default function Comment({ comment }: IProps) {
  const [showReplies, SetShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { userInfo } = useAuth();
  const likeMutation = useCommentLike();
  const deleteCommentMutation = useDeleteComment();
  const editCommentMutation = useEditComment();

  function handleCommentDelete() {
    deleteCommentMutation.mutate(comment);
  }

  function handleEditState() {
    setIsEditing((prev) => !prev);
  }

  const formater = Intl.NumberFormat('en', { notation: 'compact' });

  const likesCount = formater.format(comment.likesCount);
  const repliesCount = formater.format(comment.repliesCount);

  const commentDate = new Date(comment.timestamp);
  const commentDateFormated = formatDistance(commentDate, Date.now());

  return (
    <div className="comment">
      {comment.creator._id === userInfo?._id ? (
        <div className="post__dots-button">
          <DotsDropdown
            onDelete={() => handleCommentDelete()}
            onEdit={() => handleEditState()}
          />
        </div>
      ) : null}
      <div className="comment__header">
        <Link to={`users/${comment.creator._id}`}>
          <img
            className="comment__creator-img"
            src={`${comment.creator.profile_image.img}`}
            alt=""
            aria-label={`${comment.creator.first_name} ${comment.creator.last_name}`}
          />
        </Link>

        <div className="comment__header-right">
          <h2 className="comment__creator-name">
            <Link to={`users/${comment.creator._id}`}>
              {`${comment.creator.first_name} ${comment.creator.last_name}`}
            </Link>
          </h2>
          <Link
            to={`posts/${comment.post_id}`}
            className="comment__info"
          >{`${commentDateFormated} ${comment.edited ? '(edited)' : ''}`}</Link>
        </div>
      </div>

      {isEditing ? (
        <EditText
          text={comment.content.text}
          id={comment._id}
          toggleEditState={() => handleEditState()}
          mutation={editCommentMutation}
        />
      ) : (
        <p className="comment__content"> {comment.content.text}</p>
      )}

      <div className="comment__controllers">
        {comment.isLikedByUser ? (
          <button
            type="button"
            className="comment__controllers-like-button comment__controllers-like-button--active"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(comment) : null
            }
          >
            <AiFillLike aria-label="Remove like" />
            <p>{likesCount}</p>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(comment) : null
            }
          >
            <AiOutlineLike aria-label="Give like" /> <p>{likesCount}</p>
          </button>
        )}

        <button type="button" onClick={() => SetShowReplies((prev) => !prev)}>
          <BsArrowReturnRight
            aria-label={`${
              showReplies ? 'open replies section ' : 'close replies section'
            }`}
          />
          <p>{`${repliesCount} replies`}</p>
        </button>
      </div>

      {showReplies ? <Replies comment={comment} /> : null}
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import formatDistance from 'date-fns/formatDistance';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import { DotsDropdown, EditText } from 'components/common/index';
import { useIdIsOnArray, useAuth } from 'hooks/index';
import type { IReply } from 'types/index';
import useReplyLike from '../hooks/useReplyLike';
import useDeleteReply from '../hooks/useDeleteReply';
import useEditReply from '../hooks/useEditReply';

interface IProps {
  reply: IReply;
  queryKey: string | Array<string | number>;
}

export default function Reply({ reply, queryKey }: IProps) {
  const { content, creator, edited, likes, post_id, timestamp, _id } = reply;

  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useAuth();
  const userLikeThisReply = useIdIsOnArray(likes, userInfo?._id);

  const likeMutation = useReplyLike(queryKey);
  const deleteReplyMutation = useDeleteReply(queryKey);
  const editReplyMutation = useEditReply(queryKey);

  function handleReplyDelete() {
    deleteReplyMutation.mutate(_id);
  }

  function handleEditState() {
    setIsEditing((prev) => !prev);
  }

  const formater = Intl.NumberFormat('en', { notation: 'compact' });
  const likesCount = formater.format(likes.length);

  const replyDate = new Date(timestamp);
  const replyDateFormated = formatDistance(replyDate, Date.now());

  return (
    <div className="reply">
      {creator._id === userInfo?._id ? (
        <div className="post__dots-button">
          <DotsDropdown
            onDelete={() => handleReplyDelete()}
            onEdit={() => handleEditState()}
          />
        </div>
      ) : null}

      <div className="reply__header">
        <Link to={`users/${creator._id}`}>
          <img
            className="reply__creator-img"
            src={`${creator.profile_image.img}`}
            alt=""
            aria-label={`${creator.first_name} ${creator.last_name}`}
          />
        </Link>

        <div className="reply__header-right">
          <h2 className="reply__creator-name">
            <Link to={`users/${creator._id}`}>
              {`${creator.first_name} ${creator.last_name}`}
            </Link>
          </h2>
          <Link
            to={`posts/${post_id}`}
            className="reply__info"
          >{`${replyDateFormated} ${edited ? '(edited)' : ''}`}</Link>
        </div>
      </div>

      {isEditing ? (
        <EditText
          text={content.text}
          id={_id}
          toggleEditState={() => handleEditState()}
          mutation={editReplyMutation}
        />
      ) : (
        <p className="reply__content"> {content.text}</p>
      )}

      <div className="reply__controllers">
        {userLikeThisReply ? (
          <button
            type="button"
            className="reply__controllers-like-button reply__controllers-like-button--active"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(reply) : null
            }
          >
            <AiFillLike aria-label="Remove like" />
            <p>{likesCount}</p>
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              !likeMutation.isLoading ? likeMutation.mutate(reply) : null
            }
          >
            <AiOutlineLike aria-label="Give like" /> <p>{likesCount}</p>
          </button>
        )}
      </div>
    </div>
  );
}

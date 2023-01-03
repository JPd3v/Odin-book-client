import { Link } from 'react-router-dom';
import { useState } from 'react';
import formatDistance from 'date-fns/formatDistance';
import { BiCommentDetail } from 'react-icons/bi';
import { AiOutlineLike } from 'react-icons/ai';
import type { IComment } from './UserPost';

interface IProps {
  comment: IComment;
}

export default function Comment({ comment }: IProps) {
  const [showReplies, SetShowReplies] = useState(false);

  const formater = Intl.NumberFormat('en', { notation: 'compact' });

  const likesCount = formater.format(comment.likes.length);
  const repliesCount = formater.format(comment.replies.length);

  const commentDate = new Date(comment.timestamp);
  const commentDateFormated = formatDistance(commentDate, Date.now());

  return (
    <div className="comment">
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
      <p className="comment__content"> {comment.content.text}</p>
      <div className="comment__controllers">
        <button type="button">
          <AiOutlineLike aria-label="Give like" /> {likesCount}
        </button>
        <button type="button" onClick={() => SetShowReplies((prev) => !prev)}>
          <BiCommentDetail
            aria-label={`${
              showReplies ? 'open replies section ' : 'close replies section'
            }`}
          />
          {repliesCount}
        </button>
      </div>
      {showReplies ? <p>replies place holder</p> : null}
    </div>
  );
}

import { Link } from 'react-router-dom';
import formatDistance from 'date-fns/formatDistance';
import { AiOutlineLike } from 'react-icons/ai';
import type { Ireplies } from './UserPost';

interface IProps {
  reply: Ireplies;
}

export default function Reply({ reply }: IProps) {
  const { _id, content, creator, edited, likes, post_id, timestamp } = reply;

  const formater = Intl.NumberFormat('en', { notation: 'compact' });
  const likesCount = formater.format(likes.length);

  const replyDate = new Date(timestamp);
  const replyDateFormated = formatDistance(replyDate, Date.now());

  return (
    <div className="reply">
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
      <p className="reply__content"> {content.text}</p>
      <div className="reply__controllers">
        <button type="button">
          <AiOutlineLike aria-label="Give like" /> <p>{likesCount}</p>
        </button>
      </div>
    </div>
  );
}

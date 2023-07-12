interface IProps {
  commentsFetched: number;
  commentsCount: number;
  handleIncrement: () => void;
}

export default function CommentQuantityLimiter({
  handleIncrement,
  commentsFetched,
  commentsCount,
}: IProps) {
  function handleClick() {
    handleIncrement();
  }
  return (
    <div className="comments-controller">
      {commentsFetched < commentsCount ? (
        <button
          type="button"
          onClick={handleClick}
          className="comments-controller__show-more"
        >
          Show more comments
        </button>
      ) : null}

      {commentsFetched >= commentsCount ? (
        <p>{`${commentsCount} of ${commentsCount} Comments`}</p>
      ) : (
        <p>{`${commentsFetched} of ${commentsCount} ${
          commentsFetched < commentsCount ? '' : 'Comments'
        } `}</p>
      )}
    </div>
  );
}

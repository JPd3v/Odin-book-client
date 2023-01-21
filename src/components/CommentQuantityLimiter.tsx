interface IProps {
  currentLimit: number;
  commentsLength: number;

  handleIncrement: (increment: number) => void;
}

export default function CommentQuantityLimiter({
  handleIncrement,
  currentLimit,
  commentsLength,
}: IProps) {
  function handleClick() {
    const INCREMENT_OF_COMMENTS_LIMIT = 25;
    handleIncrement(INCREMENT_OF_COMMENTS_LIMIT);
  }
  return (
    <div className="comments-controller">
      {currentLimit < commentsLength ? (
        <button
          type="button"
          onClick={handleClick}
          className="comments-controller__show-more"
        >
          Show more comments
        </button>
      ) : null}

      <p>{`${currentLimit} of ${commentsLength} ${
        currentLimit < commentsLength ? '' : 'Comments'
      } `}</p>
    </div>
  );
}

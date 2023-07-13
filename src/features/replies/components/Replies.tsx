import useReplies from 'features/replies/hooks/useReplies';
import { BsArrowReturnRight } from 'react-icons/bs';
import { LoadingSpinner } from 'components/common';
import Reply from './Reply';
import NewReplyForm from './NewReplyForm';

interface Iprops {
  commentId: string;
  repliesCount: number;
}

export default function Replies({ commentId, repliesCount }: Iprops) {
  const QUERY_SIZE = 10;
  const replies = useReplies(commentId, QUERY_SIZE, 'desc', repliesCount);

  return (
    <div className="replies">
      {replies.hasNextPage ? (
        <button
          type="button"
          className="replies__load-more"
          onClick={() => replies.fetchNextPage()}
          disabled={replies.isFetching}
          aria-label="load more replies"
        >
          <BsArrowReturnRight aria-hidden /> Load more
        </button>
      ) : null}

      {replies.isFetchingNextPage || replies.isLoading ? (
        <div className="replies__loading">
          <LoadingSpinner />
        </div>
      ) : null}

      {replies.error ? <p>something went wrong in our servers</p> : null}

      {replies?.data?.pages.map((page) =>
        page.replies.map((reply) => <Reply key={reply._id} reply={reply} />)
      )}
      <NewReplyForm commentId={commentId} />
    </div>
  );
}

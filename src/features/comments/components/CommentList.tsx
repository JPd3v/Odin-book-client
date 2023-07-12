import CommentQuantityLimiter from 'features/comments/components/CommentQuantityLimiter';
import useComments from 'features/comments/hooks/useComments';
import NewCommentForm from './NewCommentForm';
import Comment from './Comment';

interface IProps {
  postId: string;
  commentsCount: number;
}

export default function CommentList({ postId, commentsCount }: IProps) {
  const COMMENTS_QUERY_SIZE = 15;
  const comments = useComments(
    commentsCount,
    COMMENTS_QUERY_SIZE,
    postId,
    'desc'
  );
  const commentsPages = comments?.data?.pageParams.length ?? 1;
  const commentsFetched = commentsPages * COMMENTS_QUERY_SIZE;

  return (
    <>
      <div className="comments">
        <CommentQuantityLimiter
          commentsCount={commentsCount}
          commentsFetched={commentsFetched}
          handleIncrement={() => comments.fetchNextPage()}
        />

        {comments.data?.pages?.map((page) =>
          page?.comments?.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        )}
      </div>
      <NewCommentForm postId={postId} />
    </>
  );
}

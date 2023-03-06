import type { IComment } from 'types/index';
import NewCommentForm from '../../comments/components/NewCommentForm';
import Comment from '../../comments/components/Comment';

interface IProps {
  comments: IComment[];
  postId: string;
  queryKey: string | Array<string | number>;
}

export default function PostComments({ comments, postId, queryKey }: IProps) {
  return (
    <>
      <div className="comments">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} queryKey={queryKey} />
        ))}
      </div>
      <NewCommentForm postId={postId} queryKey={queryKey} />
    </>
  );
}

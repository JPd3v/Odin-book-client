import type { IComment } from 'types/index';
import NewCommentForm from './NewCommentForm';
import Comment from './Comment';

interface IProps {
  comments: IComment[];
  postId: string;
}

export default function PostComments({ comments, postId }: IProps) {
  return (
    <>
      <div className="comments">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
      <NewCommentForm postId={postId} />
    </>
  );
}

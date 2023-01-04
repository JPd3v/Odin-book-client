import Comment from './Comment';
import type { IComment } from './UserPost';

interface IProps {
  comments: IComment[];
  commentsLimit: number;
}

export default function PostComments({ comments, commentsLimit }: IProps) {
  return (
    <div className="comments">
      {comments.slice(0, commentsLimit).map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </div>
  );
}

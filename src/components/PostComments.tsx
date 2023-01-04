import Comment from './Comment';
import NewCommentForm from './NewCommentForm';
import type { IComment } from './UserPost';

interface IProps {
  comments: IComment[];
}

export default function PostComments({ comments }: IProps) {
  return (
    <>
      <div className="comments">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </div>
      <NewCommentForm />
    </>
  );
}

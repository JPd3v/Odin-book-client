import Comment from './Comment';
import NewCommentForm from './NewCommentForm';
import type { IComment } from './UserPost';

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

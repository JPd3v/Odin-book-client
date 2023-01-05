import type { Ireplies } from './UserPost';
import Reply from './Reply';
import NewReplyForm from './NewReplyForm';

interface Iprops {
  replies: Ireplies[];
  commentId: string;
}

export default function Replies({ replies, commentId }: Iprops) {
  return (
    <div className="replies">
      {replies.map((reply) => (
        <Reply key={reply._id} reply={reply} />
      ))}
      <NewReplyForm commentId={commentId} />
    </div>
  );
}

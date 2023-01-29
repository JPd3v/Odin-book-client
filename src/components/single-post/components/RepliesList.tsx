import type { IReply } from 'types/index';
import Reply from './Reply';
import NewReplyForm from './NewReplyForm';

interface Iprops {
  replies: IReply[];
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

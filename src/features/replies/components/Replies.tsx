import type { IReply } from 'types/index';
import Reply from './Reply';
import NewReplyForm from './NewReplyForm';

interface Iprops {
  replies: IReply[];
  commentId: string;
  queryKey: string | Array<string | number>;
}

export default function Replies({ replies, commentId, queryKey }: Iprops) {
  return (
    <div className="replies">
      {replies.map((reply) => (
        <Reply key={reply._id} reply={reply} queryKey={queryKey} />
      ))}
      <NewReplyForm commentId={commentId} queryKey={queryKey} />
    </div>
  );
}

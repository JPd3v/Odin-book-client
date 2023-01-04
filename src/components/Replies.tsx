import type { Ireplies } from './UserPost';
import Reply from './Reply';

interface Iprops {
  replies: Ireplies[];
}

export default function Replies({ replies }: Iprops) {
  return (
    <div className="replies">
      {replies.map((reply) => (
        <Reply key={reply._id} reply={reply} />
      ))}
    </div>
  );
}

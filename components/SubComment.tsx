import { ReplyType } from '@/lib/queries/getComments';
import Link from 'next/link';

interface SubCommentsProps {
  replies: ReplyType[];
  commentId: string;
  postId: string;
}

export function SubComments({ replies, commentId, postId }: SubCommentsProps) {
  if (replies.length) {
    return (
      <Link href={`/post/${postId}/comment/${commentId}`}>
        <p className="text-xs text-gray-500 mt-4 hover:underline">
          View all replies
        </p>
      </Link>
    );
  } else {
    return null;
  }
}

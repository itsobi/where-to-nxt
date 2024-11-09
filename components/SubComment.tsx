import { SubCommentType } from '@/lib/queries/getComments';
import Link from 'next/link';

interface SubCommentsProps {
  subComments: SubCommentType[];
  commentId: string;
  postId: string;
}

export function SubComments({
  subComments,
  commentId,
  postId,
}: SubCommentsProps) {
  if (subComments.length > 1) {
    return (
      <Link href={`/post/${postId}/comment/${commentId}`}>
        <p className="text-xs text-gray-500 mt-4 hover:underline">
          View all {subComments.length} replies
        </p>
      </Link>
    );
  }
  if (subComments.length === 1) {
    return (
      <div>
        {subComments.map((comment) => (
          <p key={comment.id}>{comment.content}</p>
        ))}
      </div>
    );
  } else {
    return null;
  }
}

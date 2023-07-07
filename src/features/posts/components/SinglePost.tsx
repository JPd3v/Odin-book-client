import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';
import formatDistance from 'date-fns/formatDistance';
import { Link } from 'react-router-dom';
import {
  // CommentQuantityLimiter,
  DotsDropdown,
  EditText,
  LoadingPage,
} from 'components/common/index';
import { useAuth } from 'hooks/index';
// import type { IPost } from 'types/index';
import useSinglePost from 'features/posts/hooks/useSinglePost';
import { PageNotFound404 } from 'pages';
import usePostLike from '../hooks/usePostLike';
import useDeletePost from '../hooks/useDeletePost';
import useEditPost from '../hooks/useEditPost';
// import PostComments from '../../comments/components/CommentList';

export default function SinglePost() {
  const post = useSinglePost();
  const [showComments, setShowComments] = useState(true);
  // const [commentsLimit, setCommentsLimit] = useState(50);
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useAuth();

  const likeMutation = usePostLike();
  const deletePostMutation = useDeletePost('queryKey');
  const editPostMutation = useEditPost('queryKey');

  if (!post.isLoading && (post.error || post.failureCount || !post.data)) {
    return <PageNotFound404 />;
  }

  if (post.isLoading) {
    return <LoadingPage />;
  }

  // function handleIncrement(increment: number) {
  //   if (commentsLimit + increment < post.comments.length) {
  //     return setCommentsLimit((prev) => prev + increment);
  //   }
  //   return setCommentsLimit(post.comments.length);
  // }

  function handlePostDelete() {
    if (!post.data) return;
    deletePostMutation.mutate(post.data._id);
  }

  function handlePostLike() {
    if (!post.data) return;
    likeMutation.mutate(post.data);
  }

  function handleEditState() {
    setIsEditing((prev) => !prev);
  }

  const formater = Intl.NumberFormat('en', { notation: 'compact' });

  const likesCount = formater.format(post.data.likesCount);
  const commentsCount = formater.format(post.data.commentCount);

  const posttDate = new Date(post.data.timestamp);
  const postDateFormated = formatDistance(posttDate, Date.now());

  return (
    <article className="single-post">
      {post.data.creator._id === userInfo?._id ? (
        <div className="post__dots-button">
          <DotsDropdown
            onDelete={() => handlePostDelete()}
            onEdit={() => handleEditState()}
          />
        </div>
      ) : null}

      <div className="post__header">
        <Link to={`/users/${post.data.creator._id}`}>
          <img
            className="post__creator-img"
            src={`${post.data.creator.profile_image.img}`}
            alt=""
            aria-label={`${post.data.creator.first_name} ${post.data.creator.last_name}`}
          />
        </Link>

        <div className="post__header-right">
          <h2 className="post__creator-name">
            <Link to={`/users/${post.data.creator._id}`}>
              {`${post.data.creator.first_name} ${post.data.creator.last_name}`}
            </Link>
          </h2>
          <Link
            to={`/posts/${post.data._id}`}
            className="post__info"
          >{`${postDateFormated} ${post.data.edited ? '(edited)' : ''}`}</Link>
        </div>
      </div>

      {isEditing ? (
        <EditText
          text={post.data.content.text}
          id={post.data._id}
          toggleEditState={() => handleEditState()}
          mutation={editPostMutation}
        />
      ) : (
        <p className="post__content">{post.data.content.text}</p>
      )}

      {post.data.content.images.length ? (
        <div className="post__content-images">
          {post.data.content.images.map((image) => (
            <img
              src={image.img}
              alt=""
              loading="lazy"
              key={image.public_id}
              className="post__content-image"
            />
          ))}
        </div>
      ) : null}

      <div className="post__controllers">
        {post.data.isLikedByUser ? (
          <button
            type="button"
            className="post__controllers-like-button post__controllers-like-button--active"
            onClick={() => (!likeMutation.isLoading ? handlePostLike() : null)}
          >
            <AiFillLike aria-label="Remove like" />
            <p>{likesCount}</p>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => (!likeMutation.isLoading ? handlePostLike() : null)}
          >
            <AiOutlineLike aria-label="Give like" /> <p>{likesCount}</p>
          </button>
        )}

        <button type="button" onClick={() => setShowComments((prev) => !prev)}>
          <BiCommentDetail
            aria-label={`${
              showComments ? 'close comment section' : 'open comment section'
            }`}
          />
          <p>{commentsCount}</p>
        </button>
      </div>
      {/* {showComments && post.comments.length ? (
        <CommentQuantityLimiter
          commentsLength={post.comments.length}
          currentLimit={commentsLimit}
          handleIncrement={(increment) => handleIncrement(increment)}
        />
      ) : null}
      {showComments ? (
        <PostComments
          comments={postComments}
          postId={post._id}
          queryKey={queryKey}
        />
      ) : null} */}
    </article>
  );
}

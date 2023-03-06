import useFriendRequest from 'features/users/hooks/useFriendRequests';
import { Link } from 'react-router-dom';
import { useAcceptFriendRequest, useDeclineFriendRequest } from 'hooks/index';
import { LoadingSpinner } from 'components/common/index';

interface Iprops {
  onLinkClick: () => void;
}

export default function FriendRequests({ onLinkClick }: Iprops) {
  const friendsRequests = useFriendRequest();

  const acceptRequestMutation = useAcceptFriendRequest();
  const declineRequestMutation = useDeclineFriendRequest();
  function handleAcceptRequest(userId: string) {
    acceptRequestMutation.mutate(userId);
  }

  function handleDeclineRequest(userId: string) {
    declineRequestMutation.mutate(userId);
  }
  return (
    <div className="friends-requests-drop-down__content">
      <h3 className="friends-requests-drop-down__title">friend requests</h3>

      {friendsRequests?.data?.length === 0 ? (
        <p>you dont have friend requests</p>
      ) : null}

      {friendsRequests.isError ? <p>Something went wrong</p> : null}

      {friendsRequests.isLoading ? (
        <div className="friends-requests-drop-down__loading">
          <LoadingSpinner />
        </div>
      ) : null}

      <div className="friends-requests-drop-down__requests-container">
        {friendsRequests?.data?.map((request) => (
          <div
            key={request._id}
            className="friends-requests-drop-down__request"
          >
            <div className="friends-requests-drop-down__request-user">
              <Link onClick={onLinkClick} to={`/users/${request._id}`}>
                <img
                  src={request.profile_image.img}
                  alt={`${request.first_name} ${request.last_name}`}
                />
              </Link>
              <p>
                <Link
                  onClick={onLinkClick}
                  to={`/users/${request._id}`}
                >{`${request.first_name} ${request.last_name}`}</Link>
              </p>
            </div>
            <div className="friends-requests-drop-down__request-buttons">
              <button
                type="button"
                onClick={() => handleAcceptRequest(request._id)}
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => handleDeclineRequest(request._id)}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

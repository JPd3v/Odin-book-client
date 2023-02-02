import {
  useAuth,
  useIdIsOnArray,
  useAcceptFriendRequest,
  useDeclineFriendRequest,
} from 'hooks/index';
import { PageNotFound404 } from 'pages/index';
import { LoadingPage, UserCard } from 'components/common/index';
import { IUser } from 'types/index';
import useFriendRequest from 'hooks/useFriendRequests';
import { useParams } from 'react-router-dom';
import useCancelFriendRequest from '../hooks/useCancelFriendRequest';
import useAddFriend from '../hooks/useAddFriend';
import useDeleteFriend from '../hooks/useDeleteFriend';
import FriendStatusDropdown from './FriendStatusDropdown';
import PendingFriendRequestDropdown from './PendingFriendRequestDropdown';
import useUserProfile from '../hooks/useUserProfile';

export default function UserProfile() {
  const { userInfo } = useAuth();
  const currentUserFriendRequests = useFriendRequest();
  const user = useUserProfile();
  const params = useParams();

  const deleteFriendMutation = useDeleteFriend();
  const cancelFriendRequestMutation = useCancelFriendRequest();
  const addFriendMutation = useAddFriend();
  const acceptFriendMutation = useAcceptFriendRequest();
  const declineFriendMutation = useDeclineFriendRequest();

  const friendList = user.data?.friend_list ?? [];

  function handleAddFriend() {
    addFriendMutation.mutate();
  }
  function handleAcceptFriend() {
    acceptFriendMutation.mutate(params.id ?? '');
  }
  function handleDeclineFriend() {
    declineFriendMutation.mutate(params.id ?? '');
  }

  function handleCancelFriendRequest() {
    cancelFriendRequestMutation.mutate();
  }
  function handleDeleteFriend() {
    deleteFriendMutation.mutate();
  }

  function userIsOnArray(array: IUser[], id: string) {
    for (let index = 0; index < array.length; index += 1) {
      const element = array[index];
      if (element._id === id) {
        return true;
      }
      if (index === array.length - 1) {
        return false;
      }
    }
    return undefined;
  }

  const isFriend = userIsOnArray(friendList, userInfo?._id ?? '');

  const haveFriendRequestFromUser = useIdIsOnArray(
    user.data?.friend_requests ?? [],
    userInfo?._id
  );

  const isOnUserFriendRequests = userIsOnArray(
    currentUserFriendRequests.data ?? [],
    user.data?._id ?? ''
  );

  if (user.isLoading) return <LoadingPage />;
  if (user.isError) return <PageNotFound404 />;

  return (
    <>
      <div className="user-profile-wrapper">
        <div className="user-profile">
          <img
            src={`${user.data?.profile_image.img}`}
            alt=""
            className="user-profile__img"
          />

          <div className="user-profile__info">
            <h2 className="user-profile__name">{`${user.data?.first_name} ${user.data?.last_name}`}</h2>

            {isFriend ? (
              <FriendStatusDropdown onDelete={() => handleDeleteFriend()} />
            ) : null}

            {isOnUserFriendRequests && !isFriend ? (
              <PendingFriendRequestDropdown
                onAccept={() => handleAcceptFriend()}
                onCancel={() => handleDeclineFriend()}
              />
            ) : null}

            {haveFriendRequestFromUser ? (
              <button
                type="button"
                onClick={handleCancelFriendRequest}
                className="user-profile__cancel-friend-request"
              >
                Cancel friend request
              </button>
            ) : null}

            {!haveFriendRequestFromUser &&
            !isOnUserFriendRequests &&
            !isFriend &&
            user.data?._id !== userInfo?._id ? (
              <button
                type="button"
                onClick={handleAddFriend}
                className="user-profile__add-friend"
              >
                Send friend request
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="user-friends">
        <p>Friends</p>
        {user.data?.friend_list.slice(0, 20).map((friend) => (
          <UserCard key={friend._id} friend={friend} />
        ))}
      </div>
    </>
  );
}

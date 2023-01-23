import useAcceptFriendRequest from '../hooks/useAcceptFriendRequest';
import useAddFriend from '../hooks/useAddFriend';
import useAuth from '../hooks/useAuth';
import useCancelFriendRequest from '../hooks/useCancelFriendRequest';
import useDeclineFriendRequest from '../hooks/useDeclineFriendRequest';
import useDeleteFriend from '../hooks/useDeleteFriend';
import useIdIsOnArray from '../hooks/useIdIsOnArray';
import useUserProfile from '../hooks/useUserProfile';
import PageNotFound404 from '../pages/PageNotFound404';
import FriendCard from './FriendCard';
import FriendStatusDropdown from './FriendStatusDropdown';
import LoadingPage from './LoadingPage';
import PendingFriendRequestDropdown from './PendingFriendRequestDropdown';

export default function UserProfile() {
  const { userInfo } = useAuth();
  const user = useUserProfile();

  const deleteFriendMutation = useDeleteFriend();
  const cancelFriendRequestMutation = useCancelFriendRequest();
  const addFriendMutation = useAddFriend();
  const acceptFriendMutation = useAcceptFriendRequest();
  const declineFriendMutation = useDeclineFriendRequest();

  const friendList = user.data?.friend_list ?? [];

  function handleAddFriend() {
    addFriendMutation.mutate();
  }
  function handleacceptFriend() {
    acceptFriendMutation.mutate();
  }
  function handleDeclineFriend() {
    declineFriendMutation.mutate();
  }

  function handleCancelFriendRequest() {
    cancelFriendRequestMutation.mutate();
  }

  function handleDeleteFriend() {
    deleteFriendMutation.mutate();
  }

  function checkFriend() {
    for (let index = 0; index < friendList.length; index += 1) {
      const element = friendList[index];
      if (element._id === userInfo?._id) {
        return true;
      }
      if (index === friendList.length - 1) {
        return false;
      }
    }
    return undefined;
  }
  const isFriend = checkFriend();

  const haveFriendRequestFromUser = useIdIsOnArray(
    user.data?.friend_requests ?? [],
    userInfo?._id
  );

  const isOnUserFriendRequests = useIdIsOnArray(
    userInfo?.friend_requests ?? [],
    user.data?._id
  );

  if (user.isLoading) return <LoadingPage />;
  if (user.isError) return <PageNotFound404 />;

  return (
    <>
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
              onAccept={() => handleacceptFriend()}
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
      <div className="user-friends">
        <p>Friends</p>
        {user.data?.friend_list.slice(0, 20).map((friend) => (
          <FriendCard key={friend._id} friend={friend} />
        ))}
      </div>
    </>
  );
}

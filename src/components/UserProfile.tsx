import useAuth from '../hooks/useAuth';
import useIdIsOnArray from '../hooks/useIdIsOnArray';
import useUserProfile from '../hooks/useUserProfile';
import PageNotFound404 from '../pages/PageNotFound404';
import FriendCard from './FriendCard';
import LoadingPage from './LoadingPage';

export default function UserProfile() {
  const { userInfo } = useAuth();

  const user = useUserProfile();
  const friendList = user.data?.friend_list ?? [];

  console.log(user.error?.response?.status);
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

  const haveFriendRequest = useIdIsOnArray(
    user.data?.friend_requests ?? [],
    userInfo?._id
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
        <div>
          <h2 className="user-profile__name">{`${user.data?.first_name} ${user.data?.last_name}`}</h2>
          {isFriend ? <p>are Friends</p> : null}
          {haveFriendRequest ? <p>pending request</p> : null}
          {!haveFriendRequest &&
          !isFriend &&
          user.data?._id !== userInfo?._id ? (
            <p>add friend</p>
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
// return user.isLoading || user.isError ? (
//   user.isError ? (
//     <PageNotFound404 />
//   ) : (
//     <p>loading</p>
//   )
// ) : (
//   <>
//     <div className="user-profile">
//       <img
//         src={`${user.data?.profile_image.img}`}
//         alt=""
//         className="user-profile__img"
//       />
//       <div>
//         <h2 className="user-profile__name">{`${user.data?.first_name} ${user.data?.last_name}`}</h2>
//         {isFriend ? <p>are Friends</p> : null}
//         {haveFriendRequest ? <p>pending request</p> : null}
//         {!haveFriendRequest &&
//         !isFriend &&
//         user.data?._id !== userInfo?._id ? (
//           <p>add friend</p>
//         ) : null}
//       </div>
//     </div>
//     <div className="user-friends">
//       <p>Friends</p>
//       {user.data?.friend_list.slice(0, 20).map((friend) => (
//         <FriendCard key={friend._id} friend={friend} />
//       ))}
//     </div>
//   </>
// );

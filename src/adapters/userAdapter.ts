// import { IUserInfo } from "context";
import { ServerUserInfo } from './types';

export default function createUserAdapter(user: ServerUserInfo) {
  return {
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    profile_image: user.profile_image.img,
    gender: user.gender,
    birthday: user.birthday,
    email: user.username,
    oAuthId: user.oAuth_id,
  };
}

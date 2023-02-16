interface ProfileImage {
  img: string;
}

interface ServerUserInfo {
  profile_image: ProfileImage;
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  gender: string;
  birthday: string;
  oAuth_id?: string;
}

export type { ServerUserInfo };

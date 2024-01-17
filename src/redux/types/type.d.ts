declare type UserInfoType = {
  address: string;
  fullAddress: string;
  name: string;
  profileImage: string;
  profileImageOriginal: string;
  bannerImage: string;
  email: string | null;
  twitter: string | null;
  instagram: string | null;
  [key: string]: string | null;
};

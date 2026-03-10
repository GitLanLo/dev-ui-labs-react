export type UserData = {
  token: string;
  id: string | number;
  email: string;
  username: string;
  avatar: string;
  isPro: boolean;
};

export type AuthData = {
  email: string;
  password: string;
};

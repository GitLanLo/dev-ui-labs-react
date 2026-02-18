export type UserData = {
  token: string;
  id?: string;
  name?: string;
  avatarUrl?: string;
  isPro?: boolean;
  email?: string;
  username?: string;
  avatar?: string;
};

export type AuthData = {
  email: string;
  password: string;
};

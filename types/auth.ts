export type LoginRequest = {};
export type LoginResponse = {};

export type SignupRequest = {
  email: string;
  password: string;
};

export type SignupResponse = {};

export type RefreshRequest = {
  refresh_token: string;
};

export type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};

export type LoginRequest = {};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type SignupRequest = {
  email: string;
  password: string;
};

export type SignupResponse = {
  access_token: string;
  refresh_token: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type RefreshResponse = LoginResponse;

export type UserResponse = {
  id: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  companies: CompanyResponse[];
};

export type CompanyResponse = {
  company_id: string;
  company_name: string;
  role: string;
};

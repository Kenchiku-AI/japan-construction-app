import { UserProject } from './projects';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type SignupRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type SignupResponse = {
  access_token: string;
  refresh_token: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type RefreshResponse = LoginResponse;

export type CompanyResponse = {
  company_id: string;
  company_name: string;
  role: string;
};

export type CurrentUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  company?: UserCompany;
  projects: UserProject[];
};

export enum UserRole {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
}

export type UserCompany = {
  id: string;
  name: string;
  corporate_number?: string;
};

import { Report } from './reports';

export type UserProject = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  reports?: Report[];
  status: ProjectStatus;
  company_id: string;
  line_link_code: string;
};

export enum ProjectStatus {
  Active = 'active',
  Completed = 'completed',
  Requested = 'request',
}

export type UpdateProjectRequest = {
  name?: string;
  description?: string;
};

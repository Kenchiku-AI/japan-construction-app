import { Report } from './reports';

export type UserProject = {
  id: string;
  name: string;
  description: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  reports?: Report[];
  status: ProjectStatus;
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

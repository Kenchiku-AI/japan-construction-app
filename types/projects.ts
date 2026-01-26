import { Company } from './companies';
import { DailyReport } from './reports';

export type Project = {
  id: string;
  name: string;
  description: string;
  todays_report?: DailyReport;
  company: Company;
};

export enum FormJobStatus {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  NeedsReview = "needs_review",
  Failed = "failed"
}

export enum FormJobOrigin {
  Web = "web",
  Email = "email",
  Api = "api"
}

export type FormJobFile = {
  id: string;
  filename: string;
  content_type?: string;
  is_input: boolean;
  created_at: string;
}

export type FormJob = {
  id: string;
  company_id: string;
  project_id?: string;
  name: string;
  description?: string;
  status: FormJobStatus;
  origin: FormJobOrigin;
  error?: string;
  files: FormJobFile[];
  result_json: FormJobResult;
  created_at: string;
  updated_at: string;
}

export type FormJobResult = {
  output: FormJobResultOutput
}

export type FormJobResultOutput = {
  summary: string;
  missing_data: string[];
  recommendations: string[];
}

export type CreateFormJobRequest = {
  company_id: string;
  name: string;
  description: string;
  project_id?: string;
  filename: string;
  content_type: string;
}

export type CreateFormJobResponse = {
  id: string;
  name: string;
  status: FormJobStatus;
  upload_url: string;
  filename: string;
  created_at: string;
}

export type FormJobDownloadFile = {
  id: string;
  filename: string;
  content_type: string;
  download_url: string;
}

export type FormJobDownloadResponse = {
  form_job_id: string;
  files: FormJobDownloadFile[];
}

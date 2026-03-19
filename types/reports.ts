export type Report = {
  id: string;
  name: string;
  template_id: string;
  parent_type: ReportParentType;
  parent_id: string;
  company_id?: string;
  fields: ReportField[];
  photo_count: number;
  created_at: string;
  updated_at: string;
};

export type ReportField = {
  id: string;
  report_id: string;
  template_field_id: string;
  type: ReportFieldType;
  name: string;
  value: string;
};

export type CreateReportRequest = {
  template_id: string;
  parent_id: string;
  name: string;
};

export type ReportRequest = {
  name?: string;
  field_values?: ReportFieldValues;
};

export type ReportFieldValues = { [key: string]: string };

export type ReportImage = {
  id: string;
  status: string;
  download_url: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
};

export type ReportImageRequest = {
  width: number;
  height: number;
};

export type CreateImageResponse = {
  upload_url: string;
  download_url: string;
  image_id: string;
};

export type ReportTemplate = {
  id: string;
  name: string;
  description: string;
  parent_type: ReportParentType;
  unique_by: ReportUniqueBy;
  fields: ReportTemplateField[];
  is_global: boolean;
};

export type ReportTemplateField = {
  id: string;
  name: string;
  description: string;
  template_id: string;
  type: ReportFieldType;
};

export type ReportTemplateRequest = {
  name?: string;
  description?: string;
  fields?: ReportTemplateRequestField[];
  parent_type?: ReportParentType;
  unique_by?: ReportUniqueBy;
};

export type ReportTemplateRequestField = {
  name: string;
  description: string;
  type: ReportFieldType;
};

export type ShareReportTemplateRequest = {
  company_id: string;
  template_id: string;
};

export type ReportSpeechRequest = {
  text: string;
  output_language: string;
};

export type ReportSpeechResponse = {
  field_values: ReportFieldValues;
};

export enum ReportParentType {
  Company = 'company',
  Project = 'project',
}

export enum ReportFieldType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
}

export enum ReportUniqueBy {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

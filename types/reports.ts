export type Report = {
  id: string;
  name: string;
  template_id: string;
  parent_type: ReportParentType;
  parent_id: string;
  company_id?: string;
  fields: ReportField[];
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

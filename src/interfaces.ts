export interface Report {
  id?: string;
  type?: ReportType;
  size?: number;
  time?: string;
  city?: string;
  folder?: string;
  agentName?: string;
  tags?: string[];
}

export enum ReportType {
  To = 1,
  From = 2
}

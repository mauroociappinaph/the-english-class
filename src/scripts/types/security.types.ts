export interface AuditVulnerability {
  severity: string;
  via: Array<{ title: string; url: string }>;
}

export interface ToolInput {
  toolName: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: string;
}

export interface AuditResult {
  tool: string;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
  severity: "overspend" | "optimal" | "minor";
}

export interface AuditReport {
  results: AuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  topRecommendation: string;
}

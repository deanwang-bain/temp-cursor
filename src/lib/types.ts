export type Locale = "en" | "zh";

export type EVModel = {
  id: string;
  name: string;
  nameZh: string;
  segment: string;
  segmentZh: string;
  baseCycleMin: number;
  changeoverMin: number;
};

export type NewsArticle = {
  id: string;
  publishedAt: string;
  source: string;
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
  sentiment: "positive" | "neutral" | "negative";
  entities: string[];
  processed: boolean;
};

export type OntologyLayer = "raw" | "resolved" | "canonical";

export type OntologyEntity = {
  id: string;
  type: "market" | "competitor" | "policy" | "technology" | "model" | "demand_driver";
  label: string;
  labelZh: string;
  relations: { targetId: string; relation: string; relationZh: string }[];
  layer?: OntologyLayer;
  confidence?: number;
  sourceRefs?: { type: "news"; id: string; snippet: string; snippetZh?: string }[];
  resolvedBy?: string;
  firstSeenAt?: string;
  lastUpdatedAt?: string;
};

export type OntologyExtraction = {
  newsId: string;
  headline: string;
  headlineZh: string;
  rawSnippet: string;
  rawSnippetZh: string;
  extractions: {
    text: string;
    textZh?: string;
    type: string;
    confidence: number;
    resolvedOntologyId?: string;
  }[];
};

export type DemandForecast = {
  week: string;
  modelId: string;
  baseline: number;
  adjusted: number;
  signal: string;
  signalZh: string;
  agentId?: string;
  confidence?: number;
  aiRationale?: string;
  aiRationaleZh?: string;
  isForecast?: boolean;
};

export type MarketingMessage = {
  id: string;
  triggerNewsId: string;
  modelId: string;
  channel: string;
  channelZh?: string;
  message: string;
  messageZh: string;
  status: "draft" | "approved" | "live";
  agentId?: string;
  confidence?: number;
  aiRationale?: string;
  aiRationaleZh?: string;
};

export type ProductionSlot = {
  id: string;
  date: string;
  shift: "A" | "B" | "C";
  modelId: string;
  units: number;
  changeoverBeforeMin: number;
  staffRequired: number;
  note?: string;
  noteZh?: string;
};

export type ProductionHistoryPoint = {
  week: string;
  plannedUnits: number;
  actualUnits: number;
  utilization: number;
  changeoverMin: number;
  isForecast?: boolean;
};

export type PersonnelRolePlan = {
  id: string;
  role: string;
  roleZh: string;
  area: string;
  areaZh: string;
  shift: "A" | "B" | "C";
  requiredHeadcount: number;
  assignedHeadcount: number;
  skills: string[];
  skillsZh: string[];
  qualifications: string[];
  qualificationsZh: string[];
};

export type Holiday = {
  date: string;
  name: string;
  nameZh: string;
  impact: "closed" | "reduced";
};

export type Supplier = {
  id: string;
  name: string;
  nameZh: string;
  category: string;
  categoryZh: string;
  otifPercent: number;
  quantityIssueCount: number;
  lastIssueDate: string;
  flagged: boolean;
  flagReason: string;
  flagReasonZh: string;
  parts: string[];
  partsZh?: string[];
};

export type SupplierHistoryPoint = {
  month: string;
  supplierId: string;
  otif: number;
  issues: number;
  isForecast?: boolean;
};

export type MesMetrics = {
  timestamp: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  ftt: number;
  vph: number;
  targetVph: number;
  unitsToday: number;
  currentModelId: string;
  shift: string;
};

export type MesStation = {
  id: string;
  name: string;
  nameZh: string;
  status: "running" | "idle" | "alarm";
  cycleSec: number;
  defects: number;
};

export type QualityIssue = {
  id: string;
  openedAt: string;
  stationId: string;
  modelId: string;
  defectCode: string;
  defectDesc: string;
  defectDescZh: string;
  severity: "critical" | "major" | "minor";
  status: "open" | "investigating" | "closed";
  rootCause?: string;
  rootCauseZh?: string;
  supplierId?: string;
  correctiveAction?: string;
  correctiveActionZh?: string;
};

export type QualityHistoryPoint = {
  week: string;
  minor: number;
  major: number;
  critical: number;
  closed: number;
  avgClosureHours: number;
  isForecast?: boolean;
};

export type OntologyHistoryPoint = {
  week: string;
  entities: number;
  relations: number;
  extractions: number;
  resolutionRate: number;
  isForecast?: boolean;
};

export type KnowledgeArticle = {
  id: string;
  title: string;
  titleZh: string;
  category: string;
  categoryZh: string;
  content: string;
  contentZh: string;
  tags: string[];
};

export type PipelineEvent = {
  id: string;
  at: string;
  module: string;
  message: string;
  messageZh: string;
  agentId?: string;
  humanReviewed?: boolean;
};

export type ModelType = "traditional_ml" | "llm" | "hybrid" | "rules";
export type AgentStatus = "candidate" | "shadow" | "active" | "promoted" | "retired" | "retired_pending_review";

export type AgentLifecycleEvent = {
  at: string;
  type: "invented" | "promoted" | "demoted" | "retrained" | "retired" | "incident";
  note: string;
  noteZh: string;
  actor: "system" | "human";
};

export type AgentRecord = {
  id: string;
  name: string;
  nameZh: string;
  role: string;
  roleZh: string;
  module: "market" | "planning" | "suppliers" | "mes" | "quality" | "knowledge";
  teamId: string;
  managerAgentId?: string;
  modelType: ModelType;
  modelBacking: string;
  status: AgentStatus;
  autonomyLevel: 1 | 2 | 3 | 4;
  hiredAt: string;
  lastReviewAt: string;
  performance: {
    decisionsLast30d: number;
    acceptRate: number;
    humanOverrides30d: number;
    avgConfidence: number;
    driftScore: number;
    costUsd30d: number;
  };
  guardrails: {
    maxAutonomyLevel: 1 | 2 | 3 | 4;
    escalateBelowConfidence: number;
    requiresHumanApprovalAbove?: string;
  };
  lifecycle: AgentLifecycleEvent[];
  producedRefs?: { type: string; id: string }[];
};

export type OpsAlarmSeverity = "info" | "warn" | "critical";

export type OpsAlarm = {
  id: string;
  openedAt: string;
  resolvedAt?: string;
  severity: OpsAlarmSeverity;
  module: string;
  agentId?: string;
  title: string;
  titleZh: string;
  detail: string;
  detailZh: string;
  resolvedBy?: "auto" | "human";
};

export type OpsMetrics = {
  timestamp: string;
  compute: {
    gpuCount: number;
    gpuUtilPercent: number;
    cpuUtilPercent: number;
    queueDepth: number;
    p95LatencyMs: number;
  };
  tokenUsage: {
    todayPromptTokens: number;
    todayCompletionTokens: number;
    todayCostUsd: number;
    mtdCostUsd: number;
    byAgent: { agentId: string; tokens: number; costUsd: number }[];
  };
  humanInTheLoop: {
    pendingReviews: number;
    approvedToday: number;
    rejectedToday: number;
    avgReviewSeconds: number;
  };
  alarms: OpsAlarm[];
};

export type OpsHistoryPoint = {
  date: string;
  gpuUtilPercent: number;
  tokenCostUsd: number;
  humanOverrides: number;
  alarmCount: number;
  isForecast?: boolean;
};

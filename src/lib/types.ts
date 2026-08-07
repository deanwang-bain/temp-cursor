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

export type OntologyEntity = {
  id: string;
  type: "market" | "competitor" | "policy" | "technology" | "model" | "demand_driver";
  label: string;
  labelZh: string;
  relations: { targetId: string; relation: string; relationZh: string }[];
};

export type DemandForecast = {
  week: string;
  modelId: string;
  baseline: number;
  adjusted: number;
  signal: string;
  signalZh: string;
};

export type MarketingMessage = {
  id: string;
  triggerNewsId: string;
  modelId: string;
  channel: string;
  message: string;
  messageZh: string;
  status: "draft" | "approved" | "live";
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
};

import agents from "@/data/agents.json";
import opsMetrics from "@/data/ops-metrics.json";
import opsHistory from "@/data/ops-history.json";
import ontologySources from "@/data/ontology-sources.json";
import models from "@/data/models.json";
import news from "@/data/news.json";
import ontology from "@/data/ontology.json";
import demand from "@/data/demand.json";
import marketing from "@/data/marketing.json";
import productionPlan from "@/data/production-plan.json";
import productionHistory from "@/data/production-history.json";
import personnelPlan from "@/data/personnel-plan.json";
import holidays from "@/data/holidays.json";
import suppliers from "@/data/suppliers.json";
import supplierHistory from "@/data/supplier-history.json";
import mesMetrics from "@/data/mes-metrics.json";
import mesStations from "@/data/mes-stations.json";
import mesHistory from "@/data/mes-history.json";
import qualityIssues from "@/data/quality-issues.json";
import qualityHistory from "@/data/quality-history.json";
import ontologyHistory from "@/data/ontology-history.json";
import knowledge from "@/data/knowledge.json";
import pipelineEvents from "@/data/pipeline-events.json";
import type {
  DemandForecast,
  EVModel,
  Holiday,
  KnowledgeArticle,
  MarketingMessage,
  MesMetrics,
  MesStation,
  NewsArticle,
  AgentRecord,
  OntologyEntity,
  OntologyExtraction,
  OpsHistoryPoint,
  OpsMetrics,
  OntologyHistoryPoint,
  PipelineEvent,
  ProductionSlot,
  ProductionHistoryPoint,
  PersonnelRolePlan,
  QualityIssue,
  QualityHistoryPoint,
  Supplier,
  SupplierHistoryPoint,
} from "@/lib/types";

export function getModels(): EVModel[] {
  return models as EVModel[];
}

export function getNews(): NewsArticle[] {
  return news as NewsArticle[];
}

export function getOntology(): OntologyEntity[] {
  return ontology as OntologyEntity[];
}

export function getDemand(): DemandForecast[] {
  return demand as DemandForecast[];
}

export function getMarketing(): MarketingMessage[] {
  return marketing as MarketingMessage[];
}

export function getProductionPlan(): ProductionSlot[] {
  return productionPlan as ProductionSlot[];
}

export function getProductionHistory(): ProductionHistoryPoint[] {
  return productionHistory as ProductionHistoryPoint[];
}

export function getPersonnelPlan(): PersonnelRolePlan[] {
  return personnelPlan as PersonnelRolePlan[];
}

export function getHolidays(): Holiday[] {
  return holidays as Holiday[];
}

export function getSuppliers(): Supplier[] {
  return suppliers as Supplier[];
}

export function getSupplierHistory(): SupplierHistoryPoint[] {
  return supplierHistory as SupplierHistoryPoint[];
}

export function getMesMetrics(): MesMetrics {
  return mesMetrics as MesMetrics;
}

export function getMesStations(): MesStation[] {
  return mesStations as MesStation[];
}

export function getMesHistory() {
  return mesHistory as { date: string; oee: number; ftt: number; vph: number; units: number; isForecast?: boolean }[];
}

export function getQualityIssues(): QualityIssue[] {
  return qualityIssues as QualityIssue[];
}

export function getQualityHistory(): QualityHistoryPoint[] {
  return qualityHistory as QualityHistoryPoint[];
}

export function getKnowledge(): KnowledgeArticle[] {
  return knowledge as KnowledgeArticle[];
}

export function getPipelineEvents(): PipelineEvent[] {
  return pipelineEvents as PipelineEvent[];
}

export function getAgents(): AgentRecord[] {
  return agents as AgentRecord[];
}

export function getAgentById(id: string): AgentRecord | undefined {
  return getAgents().find((a) => a.id === id);
}

export function getOpsMetrics(): OpsMetrics {
  return opsMetrics as OpsMetrics;
}

export function getOpsHistory(): OpsHistoryPoint[] {
  return opsHistory as OpsHistoryPoint[];
}

export function getOntologySources(): OntologyExtraction[] {
  return ontologySources as OntologyExtraction[];
}

export function getOntologyHistory(): OntologyHistoryPoint[] {
  return ontologyHistory as OntologyHistoryPoint[];
}

export function getPlatformStats() {
  const ontologyEntities = getOntology().length;
  const agentList = getAgents();
  const activeAgents = agentList.filter((a) => a.status === "active" || a.status === "promoted").length;
  const shadowAgents = agentList.filter((a) => a.status === "shadow").length;
  const ops = getOpsMetrics();
  const openAlarms = ops.alarms.filter((a) => !a.resolvedAt).length;
  return {
    ontologyEntities,
    ontologyLayers: 3,
    activeAgents,
    shadowAgents,
    totalAgents: agentList.length,
    todayCostUsd: ops.tokenUsage.todayCostUsd,
    openAlarms,
  };
}

export function getModelName(id: string, locale: "en" | "zh"): string {
  const m = getModels().find((x) => x.id === id);
  if (!m) return id;
  return locale === "zh" ? m.nameZh : m.name;
}

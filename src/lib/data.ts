import models from "@/data/models.json";
import news from "@/data/news.json";
import ontology from "@/data/ontology.json";
import demand from "@/data/demand.json";
import marketing from "@/data/marketing.json";
import productionPlan from "@/data/production-plan.json";
import holidays from "@/data/holidays.json";
import suppliers from "@/data/suppliers.json";
import mesMetrics from "@/data/mes-metrics.json";
import mesStations from "@/data/mes-stations.json";
import mesHistory from "@/data/mes-history.json";
import qualityIssues from "@/data/quality-issues.json";
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
  OntologyEntity,
  PipelineEvent,
  ProductionSlot,
  QualityIssue,
  Supplier,
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

export function getHolidays(): Holiday[] {
  return holidays as Holiday[];
}

export function getSuppliers(): Supplier[] {
  return suppliers as Supplier[];
}

export function getMesMetrics(): MesMetrics {
  return mesMetrics as MesMetrics;
}

export function getMesStations(): MesStation[] {
  return mesStations as MesStation[];
}

export function getMesHistory() {
  return mesHistory as { date: string; oee: number; ftt: number; vph: number; units: number }[];
}

export function getQualityIssues(): QualityIssue[] {
  return qualityIssues as QualityIssue[];
}

export function getKnowledge(): KnowledgeArticle[] {
  return knowledge as KnowledgeArticle[];
}

export function getPipelineEvents(): PipelineEvent[] {
  return pipelineEvents as PipelineEvent[];
}

export function getModelName(id: string, locale: "en" | "zh"): string {
  const m = getModels().find((x) => x.id === id);
  if (!m) return id;
  return locale === "zh" ? m.nameZh : m.name;
}

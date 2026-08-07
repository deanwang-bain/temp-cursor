"use client";

import Link from "next/link";
import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card } from "@/components/ui";
import { LineChart } from "@/components/charts";
import { OntologyGraph } from "@/components/OntologyGraph";
import { DimensionDrilldown } from "@/components/DimensionDrilldown";
import { useI18n } from "@/lib/i18n/context";
import type { OntologyEntity, OntologyExtraction, OntologyHistoryPoint } from "@/lib/types";

export function OntologyClient({
  ontology,
  sources,
  history,
}: {
  ontology: OntologyEntity[];
  sources: OntologyExtraction[];
  history: OntologyHistoryPoint[];
}) {
  const { t, locale } = useI18n();
  const forecastStart = Math.max(0, history.findIndex((point) => point.isForecast) - 1);
  const typeLabels: Record<string, string> = locale === "zh" ? { policy: "政策", market: "市场", competitor: "竞争者", technology: "技术", model: "车型", demand_driver: "需求驱动" } : {};
  const extractionTypeLabels: Record<string, string> = locale === "zh" ? { policy: "政策", market: "市场", segment: "细分市场", model: "车型", competitor: "竞争者" } : {};

  return (
    <div className="space-y-5">
      <PageHeader title={t.ontology.title} subtitle={t.ontology.subtitle} prefix={t.platform.layerLabel} />

      <Card title={locale === "zh" ? "交互式本体关系图" : "Interactive ontology graph"}>
        <p className="mb-3 text-xs text-[var(--text-muted)]">{locale === "zh" ? "点击节点查看关系；按实体类型筛选图谱。" : "Select a node to inspect its relations; filter the graph by entity type."}</p>
        <OntologyGraph ontology={ontology} locale={locale} />
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title={locale === "zh" ? "八周知识图谱历史与预测" : "8-week knowledge graph history and forecast"}>
          <LineChart labels={history.map((point) => locale === "zh" ? `第${point.week.slice(1)}周` : point.week)} series={[
            { label: locale === "zh" ? "实体" : "Entities", values: history.map((point) => point.entities), color: "#3370ff", forecastFromIndex: forecastStart },
            { label: locale === "zh" ? "关系" : "Relations", values: history.map((point) => point.relations), color: "#8b5cf6", forecastFromIndex: forecastStart },
            { label: locale === "zh" ? "抽取" : "Extractions", values: history.map((point) => point.extractions), color: "#14b8a6", forecastFromIndex: forecastStart },
          ]} forecastLabel={locale === "zh" ? "预测" : "Forecast"} />
        </Card>
        <Card title={locale === "zh" ? "实体解析率" : "Entity resolution rate"}>
          <LineChart labels={history.map((point) => locale === "zh" ? `第${point.week.slice(1)}周` : point.week)} series={[{ label: locale === "zh" ? "解析率" : "Resolution rate", values: history.map((point) => point.resolutionRate), color: "#f59e0b", forecastFromIndex: forecastStart }]} valueSuffix="%" forecastLabel={locale === "zh" ? "预测" : "Forecast"} />
        </Card>
      </div>

      <Card title={locale === "zh" ? "本体多维分析" : "Ontology dimensional analysis"}>
        <DimensionDrilldown
          key={locale}
          locale={locale}
          rows={ontology.map((entity) => ({ type: entity.type, entity: entity.id, relations: entity.relations.length }))}
          dimensions={[
            { key: "type", label: locale === "zh" ? "实体类型" : "Entity type", valueLabel: (value) => typeLabels[value] || value.replace("_", " ") },
            { key: "entity", label: locale === "zh" ? "实体" : "Entity", valueLabel: (value) => { const entity = ontology.find((item) => item.id === value); return entity ? (locale === "zh" ? entity.labelZh : entity.label) : value; } },
          ]}
          measureKey="relations"
          measureLabel={locale === "zh" ? "关系数" : "Relation count"}
        />
      </Card>

      <div className="ontology-layers">
        <Card title={t.ontology.rawLayer}>
          <ul className="ontology-source-list">
            {sources.map((s) => (
              <li key={s.newsId} className="ontology-source-item">
                <div className="ontology-source-head">
                  <Badge tone="primary">{s.newsId}</Badge>
                  <span className="ontology-source-title">{locale === "zh" ? s.headlineZh : s.headline}</span>
                </div>
                <p className="ontology-snippet">{locale === "zh" ? s.rawSnippetZh : s.rawSnippet}</p>
                <ul className="ontology-extractions">
                  {s.extractions.map((ex, i) => (
                    <li key={i} className="ontology-extraction">
                      <span className="ontology-extraction-text">{locale === "zh" && ex.textZh ? ex.textZh : ex.text}</span>
                      <Badge>{extractionTypeLabels[ex.type] || ex.type}</Badge>
                      <span className="ontology-confidence">
                        {t.ontology.confidence}: {Math.round(ex.confidence * 100)}%
                      </span>
                      {ex.resolvedOntologyId && (
                        <Link href={`#${ex.resolvedOntologyId}`} className="ontology-link">
                          → {ex.resolvedOntologyId}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>

        <Card title={t.ontology.canonicalLayer}>
          <ul className="ontology-entity-list">
            {ontology.map((o) => (
              <li key={o.id} id={o.id} className="ontology-entity-item">
                <div className="ontology-entity-head">
                  <span className="ontology-entity-label">{locale === "zh" ? o.labelZh : o.label}</span>
                  <Badge tone="primary">{typeLabels[o.type] || o.type.replace("_", " ")}</Badge>
                </div>
                {o.relations.length > 0 && (
                  <div className="ontology-relations">
                    <span className="ontology-relations-label">{t.ontology.relations}:</span>
                    {o.relations.map((r, i) => (
                      <span key={i} className="ontology-relation">
                        {locale === "zh" ? r.relationZh : r.relation}{" "}
                        <Link href={`#${r.targetId}`} className="ontology-link">
                          {r.targetId}
                        </Link>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className="ontology-footnote">
            <Link href="/market" className="text-accent">
              {t.ontology.viewInMarket} →
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

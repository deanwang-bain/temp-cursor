"use client";

import Link from "next/link";
import { PageHeader } from "@/components/BrandLogo";
import { Badge, Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import type { OntologyEntity, OntologyExtraction } from "@/lib/types";

export function OntologyClient({
  ontology,
  sources,
}: {
  ontology: OntologyEntity[];
  sources: OntologyExtraction[];
}) {
  const { t, locale } = useI18n();

  return (
    <div className="space-y-5">
      <PageHeader title={t.ontology.title} subtitle={t.ontology.subtitle} prefix={t.platform.layerLabel} />

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
                      <Badge>{ex.type}</Badge>
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
                  <Badge tone="primary">{o.type}</Badge>
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

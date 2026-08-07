"use client";

import { useMemo, useState } from "react";
import type { OntologyEntity } from "@/lib/types";

const TYPE_COLORS: Record<OntologyEntity["type"], string> = {
  policy: "#8b5cf6",
  market: "#3370ff",
  competitor: "#ef4444",
  technology: "#14b8a6",
  model: "#f59e0b",
  demand_driver: "#64748b",
};

export function OntologyGraph({ ontology, locale }: { ontology: OntologyEntity[]; locale: "en" | "zh" }) {
  const [selectedId, setSelectedId] = useState(ontology[0]?.id || "");
  const [filter, setFilter] = useState<OntologyEntity["type"] | "all">("all");
  const types = [...new Set(ontology.map((entity) => entity.type))];
  const visible = filter === "all" ? ontology : ontology.filter((entity) => entity.type === filter || entity.relations.some((relation) => ontology.find((candidate) => candidate.id === relation.targetId)?.type === filter));
  const visibleIds = new Set(visible.map((entity) => entity.id));
  const selected = ontology.find((entity) => entity.id === selectedId);
  const typeLabel = (type: OntologyEntity["type"]) => locale === "zh"
    ? ({ policy: "政策", market: "市场", competitor: "竞争者", technology: "技术", model: "车型", demand_driver: "需求驱动" }[type])
    : type.replace("_", " ");
  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    ontology.forEach((entity, index) => {
      const angle = -Math.PI / 2 + (index / ontology.length) * Math.PI * 2;
      const radiusX = index % 2 === 0 ? 300 : 235;
      const radiusY = index % 2 === 0 ? 170 : 130;
      map.set(entity.id, { x: 430 + Math.cos(angle) * radiusX, y: 225 + Math.sin(angle) * radiusY });
    });
    return map;
  }, [ontology]);

  return (
    <div>
      <div className="ontology-graph-toolbar">
        <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>{locale === "zh" ? "全部" : "All"}</button>
        {types.map((type) => <button key={type} type="button" className={filter === type ? "active" : ""} onClick={() => setFilter(type)}><i style={{ background: TYPE_COLORS[type] }} />{typeLabel(type)}</button>)}
      </div>
      <div className="ontology-graph-layout">
        <div className="ontology-graph-canvas">
          <svg viewBox="0 0 860 450" role="img" aria-label={locale === "zh" ? "本体关系图" : "Ontology relationship graph"}>
            <defs>
              <marker id="ontology-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
            </defs>
            {visible.flatMap((entity) => entity.relations.map((relation) => {
              const from = positions.get(entity.id);
              const to = positions.get(relation.targetId);
              if (!from || !to || !visibleIds.has(relation.targetId)) return null;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              return (
                <g key={`${entity.id}-${relation.targetId}`}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#ontology-arrow)" />
                  <text x={midX} y={midY - 5} textAnchor="middle" className="ontology-edge-label">{locale === "zh" ? relation.relationZh : relation.relation}</text>
                </g>
              );
            }))}
            {visible.map((entity) => {
              const position = positions.get(entity.id)!;
              const active = entity.id === selectedId;
              return (
                <g key={entity.id} className="ontology-node" role="button" tabIndex={0} onClick={() => setSelectedId(entity.id)} onKeyDown={(event) => event.key === "Enter" && setSelectedId(entity.id)}>
                  <circle cx={position.x} cy={position.y} r={active ? 36 : 31} fill={TYPE_COLORS[entity.type]} opacity={active ? 1 : 0.88} stroke={active ? "#1f2329" : "#fff"} strokeWidth={active ? 4 : 3} />
                  <text x={position.x} y={position.y - 3} textAnchor="middle" className="ontology-node-type">{typeLabel(entity.type)}</text>
                  <text x={position.x} y={position.y + 47} textAnchor="middle" className="ontology-node-label">{(locale === "zh" ? entity.labelZh : entity.label).slice(0, 22)}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <aside className="ontology-graph-detail">
          {selected ? (
            <>
              <span className="ontology-type-pill" style={{ background: TYPE_COLORS[selected.type] }}>{typeLabel(selected.type)}</span>
              <h3>{locale === "zh" ? selected.labelZh : selected.label}</h3>
              <code>{selected.id}</code>
              <p>{locale === "zh" ? "出站关系" : "Outgoing relations"}: <strong>{selected.relations.length}</strong></p>
              {selected.relations.map((relation) => {
                const target = ontology.find((entity) => entity.id === relation.targetId);
                return <button type="button" key={relation.targetId} onClick={() => setSelectedId(relation.targetId)}>{locale === "zh" ? relation.relationZh : relation.relation} → <strong>{target ? (locale === "zh" ? target.labelZh : target.label) : relation.targetId}</strong></button>;
              })}
            </>
          ) : <p>{locale === "zh" ? "选择节点查看详情" : "Select a node to inspect it"}</p>}
        </aside>
      </div>
    </div>
  );
}

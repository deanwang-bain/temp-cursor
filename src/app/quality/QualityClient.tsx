"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/BrandLogo";
import { BarChart, DonutChart, LineChart } from "@/components/charts";
import { Card, Badge, MetricCard } from "@/components/ui";
import { DimensionDrilldown } from "@/components/DimensionDrilldown";
import { useI18n } from "@/lib/i18n/context";
import { getModelName } from "@/lib/data";
import type { QualityHistoryPoint, QualityIssue, Supplier } from "@/lib/types";

type IssueDecision = { owner?: string; escalated?: boolean; updatedAt: string };
type Activity = { at: string; issueId: string; text: string };

export function QualityClient({ issues, suppliers, history }: { issues: QualityIssue[]; suppliers: Supplier[]; history: QualityHistoryPoint[] }) {
  const { t, locale } = useI18n();
  const [workingIssues, setWorkingIssues] = useState(issues);
  const [decisions, setDecisions] = useState<Record<string, IssueDecision>>({});
  const [activity, setActivity] = useState<Activity[]>([]);
  const [notice, setNotice] = useState("");
  const firstForecast = history.findIndex((point) => point.isForecast);
  const forecastStart = Math.max(0, firstForecast - 1);
  const severityLabel = (severity: QualityIssue["severity"]) => locale === "zh" ? ({ minor: "轻微", major: "重大", critical: "严重" }[severity]) : severity;
  const statusLabel = (status: QualityIssue["status"]) => locale === "zh" ? ({ open: "待处理", investigating: "调查中", closed: "已关闭" }[status]) : status;

  const supplierName = (id?: string) => {
    if (!id) return "—";
    const supplier = suppliers.find((item) => item.id === id);
    return supplier ? (locale === "zh" ? supplier.nameZh : supplier.name) : id;
  };

  const addDecision = (issueId: string, text: string, update: Partial<IssueDecision>) => {
    const now = new Date().toISOString();
    const nextDecision = { ...decisions[issueId], ...update, updatedAt: now };
    setDecisions((current) => ({ ...current, [issueId]: nextDecision }));
    setActivity((current) => [{ at: now, issueId, text }, ...current]);
    localStorage.setItem(`tqm-decision-${issueId}`, JSON.stringify(nextDecision));
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const escalate = (issue: QualityIssue) => {
    setWorkingIssues((current) => current.map((item) => item.id === issue.id ? { ...item, status: "investigating" } : item));
    addDecision(issue.id, locale === "zh" ? `${issue.id} 已升级至工厂质量经理` : `${issue.id} escalated to Plant Quality Manager`, { escalated: true, owner: locale === "zh" ? "工厂质量经理" : "Plant Quality Manager" });
  };

  const assign = (issue: QualityIssue) => {
    const owner = issue.supplierId ? (locale === "zh" ? "供应商质量工程师" : "Supplier Quality Engineer") : (locale === "zh" ? "产线质量负责人" : "Line Quality Lead");
    addDecision(issue.id, locale === "zh" ? `${issue.id} 已分配给${owner}` : `${issue.id} assigned to ${owner}`, { owner });
  };

  const closeIssue = (issue: QualityIssue) => {
    if (!issue.correctiveAction) {
      setNotice(locale === "zh" ? "必须先记录纠正措施才能关闭问题" : "A corrective action is required before closure");
      return;
    }
    setWorkingIssues((current) => current.map((item) => item.id === issue.id ? { ...item, status: "closed" } : item));
    addDecision(issue.id, locale === "zh" ? `${issue.id} 已验证并关闭` : `${issue.id} verified and closed`, {});
  };

  const downloadReport = (issue: QualityIssue) => {
    const decision = decisions[issue.id];
    const report = locale === "zh" ? [
      `质量问题分析报告 — ${issue.id}`,
      `生成时间：${new Date().toISOString()}`,
      `状态：${statusLabel(issue.status)}`,
      `严重程度：${severityLabel(issue.severity)}`,
      `缺陷：${issue.defectDescZh}`,
      `代码／工位／车型：${issue.defectCode}／${issue.stationId}／${issue.modelId}`,
      `根因：${issue.rootCauseZh || "待补充"}`,
      `供应商：${supplierName(issue.supplierId)}`,
      `纠正措施：${issue.correctiveActionZh || "待补充"}`,
      `负责人：${decision?.owner || "未分配"}`,
      `是否升级：${decision?.escalated ? "是" : "否"}`,
    ].join("\n") : [
      `8D QUALITY REPORT — ${issue.id}`,
      `Generated: ${new Date().toISOString()}`,
      `Status: ${statusLabel(issue.status)}`,
      `Severity: ${severityLabel(issue.severity)}`,
      `Defect: ${issue.defectDesc}`,
      `Code / station / model: ${issue.defectCode} / ${issue.stationId} / ${issue.modelId}`,
      `Root cause: ${issue.rootCause || "Pending"}`,
      `Supplier: ${supplierName(issue.supplierId)}`,
      `Corrective action: ${issue.correctiveAction || "Pending"}`,
      `Owner: ${decision?.owner || "Unassigned"}`,
      `Escalated: ${decision?.escalated ? "Yes" : "No"}`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${issue.id}-8d-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addDecision(issue.id, locale === "zh" ? `${issue.id} 质量分析报告已生成` : `${issue.id} 8D report generated`, {});
  };

  const counts = useMemo(() => ({
    open: workingIssues.filter((issue) => issue.status !== "closed").length,
    critical: workingIssues.filter((issue) => issue.severity === "critical").length,
    supplierLinked: workingIssues.filter((issue) => issue.supplierId).length,
    escalated: Object.values(decisions).filter((decision) => decision.escalated).length,
  }), [workingIssues, decisions]);
  const stations = [...new Set(workingIssues.map((issue) => issue.stationId))];

  return (
    <div className="space-y-5">
      <PageHeader title={t.quality.title} subtitle={t.quality.subtitle} />

      {notice && <div className="decision-toast" role="status">✓ {notice}</div>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label={locale === "zh" ? "未关闭" : "Open issues"} value={counts.open} alert={counts.open > 0} />
        <MetricCard label={locale === "zh" ? "严重问题" : "Critical"} value={counts.critical} alert={counts.critical > 0} />
        <MetricCard label={locale === "zh" ? "关联供应商" : "Supplier linked"} value={counts.supplierLinked} />
        <MetricCard label={locale === "zh" ? "本次升级" : "Escalated now"} value={counts.escalated} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title={locale === "zh" ? "八周质量历史与预测" : "8-week quality history and forecast"}>
          <BarChart
            labels={history.map((point) => locale === "zh" ? `第${point.week.slice(1)}周` : point.week)}
            stacked
            series={[
              { label: locale === "zh" ? "轻微" : "Minor", values: history.map((point) => point.minor), color: "#94a3b8", forecastFromIndex: firstForecast },
              { label: locale === "zh" ? "重大" : "Major", values: history.map((point) => point.major), color: "#f59e0b", forecastFromIndex: firstForecast },
              { label: locale === "zh" ? "严重" : "Critical", values: history.map((point) => point.critical), color: "#ef4444", forecastFromIndex: firstForecast },
            ]}
            forecastLabel={locale === "zh" ? "预测" : "Forecast"}
          />
        </Card>
        <Card title={locale === "zh" ? "当前问题组合" : "Current issue profile"}>
          <DonutChart
            centerLabel={locale === "zh" ? "问题" : "Issues"}
            centerValue={workingIssues.length}
            segments={[
              { label: locale === "zh" ? "轻微" : "Minor", value: workingIssues.filter((issue) => issue.severity === "minor").length, color: "#94a3b8" },
              { label: locale === "zh" ? "重大" : "Major", value: workingIssues.filter((issue) => issue.severity === "major").length, color: "#f59e0b" },
              { label: locale === "zh" ? "严重" : "Critical", value: workingIssues.filter((issue) => issue.severity === "critical").length, color: "#ef4444" },
            ]}
          />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title={locale === "zh" ? "按工位的问题分布" : "Issues by station"}>
          <BarChart labels={stations} series={[{ label: locale === "zh" ? "问题数" : "Issue count", values: stations.map((station) => workingIssues.filter((issue) => issue.stationId === station).length), color: "#8b5cf6" }]} />
        </Card>
        <Card title={locale === "zh" ? "平均关闭时长" : "Average closure time"}>
          <LineChart labels={history.map((point) => locale === "zh" ? `第${point.week.slice(1)}周` : point.week)} series={[{ label: locale === "zh" ? "小时" : "Hours", values: history.map((point) => point.avgClosureHours), color: "#14b8a6", forecastFromIndex: forecastStart }]} forecastLabel={locale === "zh" ? "预测" : "Forecast"} />
        </Card>
      </div>

      <Card title={locale === "zh" ? "质量多维分析" : "Quality dimensional analysis"}>
        <DimensionDrilldown
          key={locale}
          locale={locale}
          rows={workingIssues.map((issue) => ({ severity: issue.severity, station: issue.stationId, model: issue.modelId, issues: 1 }))}
          dimensions={[
            { key: "severity", label: locale === "zh" ? "严重程度" : "Severity", valueLabel: (value) => severityLabel(value as QualityIssue["severity"]) },
            { key: "station", label: locale === "zh" ? "工位" : "Station" },
            { key: "model", label: locale === "zh" ? "车型" : "Model", valueLabel: (value) => getModelName(value, locale) },
          ]}
          measureKey="issues"
          measureLabel={locale === "zh" ? "问题数" : "Issue count"}
        />
      </Card>

      <Card title={locale === "zh" ? "质量决策工作台" : "Quality decision workbench"}>
        <div className="space-y-4">
          {workingIssues.map((issue) => {
            const decision = decisions[issue.id];
            return (
              <article key={issue.id} className={`quality-issue ${decision?.escalated ? "quality-issue-escalated" : ""}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-zinc-400">{issue.id}</span>
                  <Badge tone={issue.severity === "critical" ? "danger" : issue.severity === "major" ? "warn" : "default"}>{severityLabel(issue.severity)}</Badge>
                  <Badge tone={issue.status === "closed" ? "success" : "primary"}>{statusLabel(issue.status)}</Badge>
                  {decision?.escalated && <Badge tone="danger">{locale === "zh" ? "已升级" : "Escalated"}</Badge>}
                  <span className="text-xs text-zinc-400">{new Date(issue.openedAt).toLocaleString()}</span>
                </div>
                <h3 className="mt-2 font-semibold">{locale === "zh" ? issue.defectDescZh : issue.defectDesc}</h3>
                <p className="text-xs text-zinc-500">{issue.defectCode} · {issue.stationId} · {issue.modelId}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="quality-detail"><span>{t.quality.rootCause}</span><p>{locale === "zh" ? issue.rootCauseZh || "—" : issue.rootCause || "—"}</p></div>
                  <div className="quality-detail"><span>{t.quality.supplier}</span><p>{supplierName(issue.supplierId)}</p></div>
                  <div className="quality-detail"><span>{t.quality.corrective}</span><p>{locale === "zh" ? issue.correctiveActionZh || "—" : issue.correctiveAction || "—"}</p></div>
                </div>
                {decision?.owner && <p className="mt-2 text-xs font-medium text-[var(--primary)]">{locale === "zh" ? "负责人" : "Owner"}: {decision.owner}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary !min-h-9" onClick={() => assign(issue)}>{locale === "zh" ? "分配负责人" : "Assign owner"}</button>
                  <button type="button" className="btn-secondary !min-h-9" onClick={() => downloadReport(issue)}>{locale === "zh" ? "生成质量分析报告" : "Generate 8D report"}</button>
                  {issue.status !== "closed" && <button type="button" className="btn-danger !min-h-9" onClick={() => escalate(issue)}>{locale === "zh" ? "升级处理" : "Escalate"}</button>}
                  {issue.status !== "closed" && <button type="button" className="btn-primary !min-h-9" onClick={() => closeIssue(issue)}>{locale === "zh" ? "验证并关闭" : "Verify & close"}</button>}
                </div>
              </article>
            );
          })}
        </div>
      </Card>

      {activity.length > 0 && (
        <Card title={locale === "zh" ? "决策记录" : "Decision log"}>
          <ul className="decision-log">
            {activity.map((entry, index) => <li key={`${entry.at}-${index}`}><time>{new Date(entry.at).toLocaleTimeString()}</time><Badge>{entry.issueId}</Badge><span>{entry.text}</span></li>)}
          </ul>
        </Card>
      )}
    </div>
  );
}

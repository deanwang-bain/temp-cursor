import { OpsClient } from "./OpsClient";
import { getOpsHistory, getOpsMetrics } from "@/lib/data";

export default function OpsPage() {
  return <OpsClient ops={getOpsMetrics()} history={getOpsHistory()} />;
}

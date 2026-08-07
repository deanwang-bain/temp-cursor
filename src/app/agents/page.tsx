import { AgentsClient } from "./AgentsClient";
import { getAgents } from "@/lib/data";

export default function AgentsPage() {
  return <AgentsClient agents={getAgents()} />;
}

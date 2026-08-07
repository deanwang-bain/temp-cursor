import { KnowledgeClient } from "./KnowledgeClient";
import { getKnowledge } from "@/lib/data";

export default function KnowledgePage() {
  return <KnowledgeClient articles={getKnowledge()} />;
}

import { HomeClient } from "./HomeClient";
import { getPipelineEvents, getPlatformStats } from "@/lib/data";

export default function HomePage() {
  const events = getPipelineEvents();
  const stats = getPlatformStats();
  return <HomeClient events={events} stats={stats} />;
}

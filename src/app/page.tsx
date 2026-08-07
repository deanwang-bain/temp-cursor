import { HomeClient } from "./HomeClient";
import { getPipelineEvents } from "@/lib/data";

export default function HomePage() {
  const events = getPipelineEvents();
  return <HomeClient events={events} />;
}

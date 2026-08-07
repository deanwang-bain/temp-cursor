import { MesClient } from "./MesClient";
import { getMesHistory, getMesMetrics, getMesStations, getModels } from "@/lib/data";

export default function MesPage() {
  return (
    <MesClient
      initialMetrics={getMesMetrics()}
      stations={getMesStations()}
      history={getMesHistory()}
      models={getModels()}
    />
  );
}

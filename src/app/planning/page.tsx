import { PlanningClient } from "./PlanningClient";
import { getHolidays, getModels, getProductionPlan } from "@/lib/data";

export default function PlanningPage() {
  return (
    <PlanningClient
      plan={getProductionPlan()}
      holidays={getHolidays()}
      models={getModels()}
    />
  );
}

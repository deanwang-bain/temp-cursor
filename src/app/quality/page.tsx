import { QualityClient } from "./QualityClient";
import { getQualityIssues, getSuppliers } from "@/lib/data";

export default function QualityPage() {
  return <QualityClient issues={getQualityIssues()} suppliers={getSuppliers()} />;
}

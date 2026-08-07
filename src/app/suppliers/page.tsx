import { SuppliersClient } from "./SuppliersClient";
import { getSuppliers } from "@/lib/data";

export default function SuppliersPage() {
  return <SuppliersClient suppliers={getSuppliers()} />;
}

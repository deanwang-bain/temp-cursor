import { SuppliersClient } from "./SuppliersClient";
import { getSupplierHistory, getSuppliers } from "@/lib/data";

export default function SuppliersPage() {
  return <SuppliersClient suppliers={getSuppliers()} history={getSupplierHistory()} />;
}

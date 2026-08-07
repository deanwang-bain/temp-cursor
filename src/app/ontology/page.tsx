import { OntologyClient } from "./OntologyClient";
import { getOntology, getOntologyHistory, getOntologySources } from "@/lib/data";

export default function OntologyPage() {
  return <OntologyClient ontology={getOntology()} sources={getOntologySources()} history={getOntologyHistory()} />;
}

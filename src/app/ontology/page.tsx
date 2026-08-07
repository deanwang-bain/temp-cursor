import { OntologyClient } from "./OntologyClient";
import { getOntology, getOntologySources } from "@/lib/data";

export default function OntologyPage() {
  return <OntologyClient ontology={getOntology()} sources={getOntologySources()} />;
}

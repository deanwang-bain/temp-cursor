import { MarketClient } from "./MarketClient";
import {
  getDemand,
  getMarketing,
  getNews,
  getOntology,
} from "@/lib/data";

export default function MarketPage() {
  return (
    <MarketClient
      news={getNews()}
      ontology={getOntology()}
      demand={getDemand()}
      marketing={getMarketing()}
    />
  );
}

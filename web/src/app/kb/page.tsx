import { listKbDocs } from "@/lib/kb";
import { KbIndexClient } from "@/components/KbIndexClient";

export default function KbIndexPage() {
  const docs = listKbDocs();
  return <KbIndexClient docs={docs} />;
}

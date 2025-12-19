import { ModuleProgressList } from "@/components/ModuleProgressList";
import { UrbanPotentialHero } from "@/components/UrbanPotentialHero";
import { listModuleDocs } from "@/lib/modules";

export default function Home() {
  const modules = listModuleDocs().map((m) => ({
    id: m.id,
    title: m.title,
    href: "/modules/" + encodeURIComponent(m.slug),
  }));

  return (
    <main className="container stack">
      <UrbanPotentialHero />

      <section className="card">
        <ModuleProgressList modules={modules} />
      </section>
    </main>
  );
}

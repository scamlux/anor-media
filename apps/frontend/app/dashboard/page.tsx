"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { CostIndicator } from "@/components/ui/CostIndicator";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/features/ProjectCard";

export default function DashboardPage() {
  const { projects, isLoading, error } = useProjects();

  return (
    <ProtectedRoute>
      <AppLayout>
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Projects</p>
            <p className="text-2xl font-semibold">{projects.length}</p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Monthly Cost</p>
            <p className="text-2xl font-semibold">
              <CostIndicator cost={projects.length * 12.5} />
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Generation Health</p>
            <p className="text-2xl font-semibold">Stable</p>
          </article>
        </section>

        {isLoading ? <p>Loading projects...</p> : null}
        {error ? <p className="text-danger">{error}</p> : null}
        <section className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </AppLayout>
    </ProtectedRoute>
  );
}

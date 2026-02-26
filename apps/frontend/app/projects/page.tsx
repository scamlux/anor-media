"use client";

import { useForm } from "react-hook-form";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { ProjectCard } from "@/components/features/ProjectCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProjects } from "@/hooks/useProjects";
import { useProjectActions } from "@/hooks/useProjectActions";

interface CreateProjectValues {
  name: string;
  description: string;
  campaign_goal: string;
  tone: string;
  audience: string;
  compliance_notes: string;
}

export default function ProjectsPage() {
  const { projects, refetch } = useProjects();
  const actions = useProjectActions();
  const { register, handleSubmit, reset } = useForm<CreateProjectValues>();

  return (
    <ProtectedRoute>
      <AppLayout>
        <h2 className="mb-4 text-2xl font-semibold">Projects</h2>

        <RoleGuard allow={["admin", "editor"]}>
          <form
            className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3"
            onSubmit={handleSubmit(async (values) => {
              await actions.create({
                name: values.name,
                description: values.description,
                campaign_goal: values.campaign_goal,
                brand_context: {
                  tone: values.tone,
                  audience: values.audience,
                  compliance_notes: values.compliance_notes,
                  allowed_emojis: false
                }
              });
              reset();
              await refetch();
            })}
          >
            <Input {...register("name", { required: true })} placeholder="Project Name" />
            <Input {...register("campaign_goal", { required: true })} placeholder="Campaign Goal" />
            <Input {...register("description")} placeholder="Description" />
            <Input {...register("tone", { required: true })} placeholder="Brand Tone" />
            <Input {...register("audience", { required: true })} placeholder="Audience" />
            <Input {...register("compliance_notes", { required: true })} placeholder="Compliance Notes" />
            <Button type="submit" className="md:col-span-3">
              Create Project
            </Button>
          </form>
        </RoleGuard>

        <section className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </AppLayout>
    </ProtectedRoute>
  );
}

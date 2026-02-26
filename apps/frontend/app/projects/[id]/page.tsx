"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { GeneratePlanForm } from "@/components/forms/GeneratePlanForm";
import { ContentPlanTable } from "@/components/features/ContentPlanTable";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useProjectActions } from "@/hooks/useProjectActions";
import { usePlanActions } from "@/hooks/usePlanActions";
import { useProjectStore } from "@/store/projectStore";

interface BrandFormValues {
  tone: string;
  audience: string;
  compliance_notes: string;
}

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const projectActions = useProjectActions();
  const planActions = usePlanActions(projectId);
  const { currentProject, brandContext, setProjectContext } = useProjectStore();
  const { register, handleSubmit, reset } = useForm<BrandFormValues>();

  useEffect(() => {
    void (async () => {
      const details = await projectActions.loadDetails(projectId);
      if (details) {
        setProjectContext(details.project, details.brandContext);
        reset({
          tone: details.brandContext.tone,
          audience: details.brandContext.audience,
          compliance_notes: details.brandContext.compliance_notes
        });
      }
      await planActions.refreshPlans();
    })();
  }, [projectId, reset, setProjectContext]);

  const latestPlan = planActions.plans[0] ?? null;

  return (
    <ProtectedRoute>
      <AppLayout>
        <h2 className="mb-1 text-2xl font-semibold">{currentProject?.name ?? "Project"}</h2>
        <p className="mb-4 text-sm text-slate-600">{currentProject?.campaign_goal}</p>

        <RoleGuard allow={["admin", "editor"]}>
          <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-3 font-semibold">Brand Brain</h3>
            <form
              className="grid gap-3 md:grid-cols-3"
              onSubmit={handleSubmit(async (values) => {
                await projectActions.updateBrand(projectId, {
                  tone: values.tone,
                  audience: values.audience,
                  compliance_notes: values.compliance_notes,
                  allowed_emojis: brandContext?.allowed_emojis ?? false
                });
              })}
            >
              <Input {...register("tone", { required: true })} placeholder="Tone" />
              <Input {...register("audience", { required: true })} placeholder="Audience" />
              <Input {...register("compliance_notes", { required: true })} placeholder="Compliance Notes" />
              <Button type="submit" className="md:col-span-3">
                Save Brand Brain
              </Button>
            </form>
          </section>

          <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="mb-3 font-semibold">Generate Content Plan</h3>
            <GeneratePlanForm
              isLoading={planActions.isLoading}
              onSubmit={async (values) => {
                await planActions.requestGeneration(values);
              }}
            />
          </section>
        </RoleGuard>

        {latestPlan ? (
          <ContentPlanTable
            plan={latestPlan}
            onConfirm={async (planId) => {
              await planActions.confirm(planId);
            }}
          />
        ) : (
          <p className="rounded border border-slate-200 bg-white p-4">No plan generated yet.</p>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}

"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useProjectLogs } from "@/hooks/useProjectLogs";

export default function SettingsPage() {
  const [projectId, setProjectId] = useState("");
  const projectLogs = useProjectLogs();

  return (
    <ProtectedRoute>
      <AppLayout>
        <h2 className="mb-4 text-2xl font-semibold">Settings & Logs</h2>
        <div className="mb-4 flex gap-2">
          <Input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="Project ID" />
          <Button
            onClick={async () => {
              await projectLogs.load(projectId);
            }}
          >
            Load Logs
          </Button>
        </div>

        {projectLogs.error ? <p className="mb-3 text-danger">{projectLogs.error}</p> : null}

        {projectLogs.logs ? (
          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="mb-2 font-semibold">Generation Logs</h3>
              <pre className="max-h-96 overflow-auto text-xs">{JSON.stringify(projectLogs.logs.generationLogs, null, 2)}</pre>
            </section>
            <section className="rounded-lg border border-slate-200 bg-white p-4">
              <h3 className="mb-2 font-semibold">Audit Logs</h3>
              <pre className="max-h-96 overflow-auto text-xs">{JSON.stringify(projectLogs.logs.auditLogs, null, 2)}</pre>
            </section>
          </div>
        ) : null}
      </AppLayout>
    </ProtectedRoute>
  );
}

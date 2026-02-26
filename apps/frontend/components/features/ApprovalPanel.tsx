"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ApprovalFormValues {
  decision: "approved" | "rejected";
  comment?: string;
}

interface ApprovalPanelProps {
  onSubmit: (values: ApprovalFormValues) => Promise<void>;
}

export function ApprovalPanel({ onSubmit }: ApprovalPanelProps) {
  const { register, handleSubmit, watch } = useForm<ApprovalFormValues>({
    defaultValues: {
      decision: "approved",
      comment: ""
    }
  });

  const decision = watch("decision");

  return (
    <form className="space-y-3 rounded-lg border border-slate-200 bg-white p-4" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="font-semibold">Approval Workflow</h3>
      <label className="flex items-center gap-2 text-sm">
        <input type="radio" value="approved" {...register("decision")} /> Approve
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="radio" value="rejected" {...register("decision")} /> Reject
      </label>
      {decision === "rejected" ? (
        <Input {...register("comment", { required: true })} placeholder="Rejection reason" />
      ) : null}
      <Button type="submit">Submit</Button>
    </form>
  );
}

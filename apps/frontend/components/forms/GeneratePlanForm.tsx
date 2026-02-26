"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

interface GeneratePlanValues {
  period_days: number;
  campaign_type: string;
  compliance_mode: boolean;
}

interface GeneratePlanFormProps {
  isLoading: boolean;
  onSubmit: (values: GeneratePlanValues) => Promise<void>;
}

export function GeneratePlanForm({ isLoading, onSubmit }: GeneratePlanFormProps) {
  const { register, handleSubmit } = useForm<GeneratePlanValues>({
    defaultValues: {
      period_days: 30,
      campaign_type: "product",
      compliance_mode: true
    }
  });

  return (
    <form className="grid gap-3 md:grid-cols-4" onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("period_days", { valueAsNumber: true, min: 1, max: 90 })} type="number" placeholder="Period Days" />
      <Input {...register("campaign_type", { required: true })} placeholder="Campaign Type" />
      <label className="inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm">
        <Checkbox {...register("compliance_mode")} /> Compliance Mode
      </label>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate plan"}
      </Button>
    </form>
  );
}

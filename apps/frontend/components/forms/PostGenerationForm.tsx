"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

interface PostGenerationValues {
  format_type: string;
  additional_comments: string;
  strict_numbers_mode: boolean;
  compliance_mode: boolean;
}

interface PostGenerationFormProps {
  isLoading: boolean;
  onSubmit: (values: PostGenerationValues) => Promise<void>;
}

export function PostGenerationForm({ isLoading, onSubmit }: PostGenerationFormProps) {
  const { register, handleSubmit } = useForm<PostGenerationValues>({
    defaultValues: {
      format_type: "text+image",
      strict_numbers_mode: true,
      compliance_mode: true
    }
  });

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block text-sm">Format</label>
        <Select {...register("format_type", { required: true })}>
          <option value="text">Text</option>
          <option value="text+image">Text + Image</option>
          <option value="video">Video</option>
        </Select>
      </div>

      <div>
        <label className="mb-1 block text-sm">Additional comments</label>
        <Input {...register("additional_comments", { required: true, minLength: 3 })} placeholder="Deposit 24%, 18 months" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox {...register("strict_numbers_mode")} /> Strict Numbers Mode
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox {...register("compliance_mode")} /> Compliance Mode
      </label>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Generating..." : "Generate post"}
      </Button>
    </form>
  );
}

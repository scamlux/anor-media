"use client";

import Link from "next/link";
import type { Project } from "@/types/api";
import { Button } from "@/components/ui/Button";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{project.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{project.description ?? "No description"}</p>
      <p className="mt-2 text-sm">Goal: {project.campaign_goal}</p>
      <Link href={`/projects/${project.id}`} className="mt-4 inline-block">
        <Button>Open</Button>
      </Link>
    </article>
  );
}

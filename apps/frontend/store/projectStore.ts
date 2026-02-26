import { create } from "zustand";
import type { BrandContext, Project } from "@/types/api";

interface ProjectState {
  currentProject: Project | null;
  brandContext: BrandContext | null;
  setProjectContext: (project: Project, brandContext: BrandContext) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  brandContext: null,
  setProjectContext: (project, brandContext) => set({ currentProject: project, brandContext })
}));

import { useState, useEffect } from "react";
import type { Project } from "../Models";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem("projects");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = (p: Project) => setProjects((prev) => [...prev, p]);

  const updateProject = (updatedProject: Project) =>
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));

  const deleteProject = (id: string) =>
    setProjects((prev) => prev.filter((p) => p.id !== id));

  return { projects, addProject, updateProject, deleteProject, setProjects };
};
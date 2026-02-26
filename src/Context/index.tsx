import React, { createContext, useMemo, useContext } from "react";
import { useUsers } from "./users";
import { useProjects } from "./projects";
import type { AppContextType } from "./types";
import * as userStoriesFuncs from "./userStories";

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const { projects, addProject, updateProject, deleteProject, setProjects } = useProjects();

  const value = useMemo<AppContextType>(() => ({
    users,
    projects,
    addUser,
    updateUser,
    deleteUser,
    addProject,
    updateProject,
    deleteProject,
    addUserStory: (projectId, story) => userStoriesFuncs.addUserStory(projects, setProjects, projectId, story),
    updateUserStory: (projectId, story) => userStoriesFuncs.updateUserStory(projects, setProjects, projectId, story),
    deleteUserStory: (projectId, storyId) => userStoriesFuncs.deleteUserStory(projects, setProjects, projectId, storyId),
    updateUserStoryStatus: (projectId, storyId, status) => userStoriesFuncs.updateUserStoryStatus(projects, setProjects, projectId, storyId, status),
  }), [users, projects]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
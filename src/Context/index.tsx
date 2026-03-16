import React, { createContext, useMemo, useContext, useCallback } from "react";
import type { AppContextType } from "./types";
import { useAdminState } from "./admins";


const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, setAdmin, currentUser, setCurrentUser, addAdmin, addUser, updateUser, deleteUser, addProject, updateProject, deleteProject, updateProjectStatus, addUserStory, updateUserStory, deleteUserStory, updateUserStoryStatus, addUserStoryComment } = useAdminState();

  const logout = useCallback(() => {
    setAdmin(null);
    setCurrentUser(null);
  }, [setAdmin, setCurrentUser]);


  const value = useMemo<AppContextType>(() => ({
    admin,
    currentUser,
    logout,
    setAdmin,
    setCurrentUser,
    users: admin?.users ?? [],
    projects: admin?.projects ?? [],
    addAdmin,
    addUser,
    updateUser,
    deleteUser,
    addProject,
    updateProject,
    deleteProject,
    updateProjectStatus,
    addUserStory,
    updateUserStory,
    deleteUserStory,
    updateUserStoryStatus,
    addUserStoryComment,
  }), [admin, setAdmin, currentUser, setCurrentUser, addAdmin, addUser, updateUser, deleteUser, addProject, updateProject, deleteProject, updateProjectStatus, addUserStory, updateUserStory, deleteUserStory, updateUserStoryStatus, addUserStoryComment, logout]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
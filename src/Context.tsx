import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import type { User, Project, UserStory } from "../src/Models";
import randomHexColor from "./Hooks/useRandomHexColor";

type UserStoryStatus = "Backlog" | "In Progress" | "Testing" | "Completed";

interface AppContextType {
  users: User[];
  projects: Project[];
  addUser: (u: Omit<User, "avatarColor">) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (id: string) => void;
  addProject: (p: Project) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (id: string) => void;
  addUserStory: (projectId: string, s: UserStory) => void;
  updateUserStory: (projectId: string, updatedStory: UserStory) => void;
  deleteUserStory: (projectId: string, storyId: string) => void;
  updateUserStoryStatus: (
    projectId: string,
    storyId: string,
    newStatus: UserStoryStatus,
  ) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem("projects");
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addUser = (u: Omit<User, "avatarColor">) =>
    setUsers((prev) => [...prev, { ...u, avatarColor: randomHexColor() }]);

  const updateUser = (updatedUser: User) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );

  const deleteUser = (id: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  const addProject = (p: Project) => setProjects((prev) => [...prev, p]);

  const updateProject = (updatedProject: Project) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    );

  const deleteProject = (id: string) =>
    setProjects((prev) => prev.filter((p) => p.id !== id));

  const addUserStory = (projectId: string, story: UserStory) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, userStories: [...p.userStories, story] }
          : p,
      ),
    );

  const updateUserStory = (projectId: string, updatedStory: UserStory) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              userStories: p.userStories.map((s) =>
                s.id === updatedStory.id ? updatedStory : s,
              ),
            }
          : p,
      ),
    );

  const updateUserStoryStatus = (
    projectId: string,
    storyId: string,
    newStatus: UserStoryStatus,
  ) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              userStories: p.userStories.map((s) =>
                s.id === storyId ? { ...s, status: newStatus } : s,
              ),
            }
          : p,
      ),
    );

  const deleteUserStory = (projectId: string, storyId: string) =>
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, userStories: p.userStories.filter((s) => s.id !== storyId) }
          : p,
      ),
    );

  const value = useMemo(
    () => ({
      users,
      projects,
      addUser,
      updateUser,
      deleteUser,
      addProject,
      updateProject,
      deleteProject,
      addUserStory,
      updateUserStory,
      deleteUserStory,
      updateUserStoryStatus,
    }),
    [users, projects],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

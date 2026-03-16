import { useState, useEffect } from "react";
import type {
  Admin,
  Project,
  User,
  UserStory,
  UserStoryStatus,
  Role,
} from "../Models";

export const useAdminState = () => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = sessionStorage.getItem("activeAdmin");
    return stored ? JSON.parse(stored) : null;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (admin) {
      sessionStorage.setItem("activeAdmin", JSON.stringify(admin));
    } else {
      sessionStorage.removeItem("activeAdmin");
    }
  }, [admin]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const updateAdminInStorage = (updatedAdmin: Admin) => {
    const storedAdmins = localStorage.getItem("admins");
    const allAdmins: Admin[] = storedAdmins ? JSON.parse(storedAdmins) : [];
    const adminExists = allAdmins.some((a) => a.id === updatedAdmin.id);

    const newAllAdmins = adminExists
      ? allAdmins.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a))
      : [...allAdmins, updatedAdmin];

    localStorage.setItem("admins", JSON.stringify(newAllAdmins));
  };

  const generateRandomHexColor = () => {
    return (
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    );
  };

  const addAdmin = (adminData: Omit<Admin, "id">) => {
    const newAdmin: Admin = {
      ...adminData,
      id: Date.now(),
    };

    updateAdminInStorage(newAdmin);

    setAdmin(newAdmin);

    const adminUser = newAdmin.users.find((u) => u.role === "Admin");
    if (adminUser) setCurrentUser(adminUser);

    return newAdmin;
  };

  const addUser = (
    userData: Omit<User, "avatarColor" | "password">,
    password: string,
  ) => {
    if (!admin || !currentUser || currentUser.role !== "Admin") {
      console.error("Authorization Error: Only Admins can add users.");
      return;
    }
    const newUser: User = {
      ...userData,
      avatarColor: generateRandomHexColor(),
      password: password,
    };
    const newState = admin
      ? { ...admin, users: [...admin.users, newUser] }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const updateUser = (updatedUser: User) => {
    if (currentUser?.role === "Developer" || currentUser?.role === "Tester") {
      alert("You don't have access to update users");
      return;
    }
    if (!admin || !currentUser || currentUser.role !== "Admin") {
      console.error("Authorization Error: Only Admins can update users.");
      return;
    }
    const newState = admin
      ? {
          ...admin,
          users: admin.users.map((u) =>
            u.id === updatedUser.id ? updatedUser : u,
          ),
        }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
      if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
      }
    }
  };

  const deleteUser = (userId: number) => {
    if (!admin || !currentUser || currentUser.role !== "Admin") {
      console.error("Authorization Error: Only Admins can delete users.");
      return;
    }
    if (currentUser.id === userId) {
      console.error("Authorization Error: Admins cannot delete themselves.");
      return;
    }
    if (admin) {
      const updatedUsers = admin.users.filter((u) => u.id !== userId);
      const updatedProjects = admin.projects.map((p) => ({
        ...p,
        teamMembers: p.teamMembers.filter((tm) => tm.id !== userId),
      }));
      const newState = {
        ...admin,
        users: updatedUsers,
        projects: updatedProjects,
      };
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const addProject = (projectData: Project) => {
    if (!admin || !currentUser || currentUser.role !== "Admin") {
      console.error("Authorization Error: Only Admins can create projects.");
      return;
    }
    const newState = admin
      ? { ...admin, projects: [...admin.projects, projectData] }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const updateProject = (updatedProject: Project) => {
    if (
      !admin ||
      !currentUser ||
      !["Admin", "Manager"].includes(currentUser.role)
    ) {
      console.error(
        "Authorization Error: You do not have permission to update projects.",
      );
      return;
    }
    const newState = admin
      ? {
          ...admin,
          projects: admin.projects.map((p) =>
            p.id === updatedProject.id ? updatedProject : p,
          ),
        }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const deleteProject = (projectId: number) => {
    if (!admin || !currentUser || currentUser.role !== "Admin") {
      console.error("Authorization Error: Only Admins can delete projects.");
      return;
    }
    const newState = admin
      ? { ...admin, projects: admin.projects.filter((p) => p.id !== projectId) }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const updateProjectStatus = (projectId: number, newStatus: string) => {
    if (
      !admin ||
      !currentUser ||
      !["Admin", "Manager"].includes(currentUser.role)
    ) {
      console.error(
        "Authorization Error: You do not have permission to update project status.",
      );
      return;
    }
    const newState = admin
      ? {
          ...admin,
          projects: admin.projects.map((p) =>
            p.id === projectId ? { ...p, status: newStatus } : p,
          ),
        }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const addUserStory = (projectId: number, story: UserStory) => {
    if (!admin || !currentUser) return;

    const canCreate =
      currentUser.role === "Manager" ||
      (currentUser.role === "Tester" && story.isBug);

    if (!canCreate) {
      console.error(
        "Authorization Error: You do not have permission to create this story/bug.",
      );
      return;
    }
    const newState = admin
      ? {
          ...admin,
          projects: admin.projects.map((p) =>
            p.id === projectId
              ? { ...p, userStories: [...p.userStories, story] }
              : p,
          ),
        }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const updateUserStory = (projectId: number, updatedStory: UserStory) => {
    if (!admin || !currentUser || currentUser.role !== "Manager") {
      console.error(
        "Authorization Error: Only Managers can assign stories or change priority/details.",
      );
      return;
    }
    const newState = admin
      ? {
          ...admin,
          projects: admin.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  userStories: p.userStories.map((s) =>
                    s.id === updatedStory.id ? updatedStory : s,
                  ),
                }
              : p,
          ),
        }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const deleteUserStory = (projectId: number, storyId: number) => {
    if (!admin || !currentUser || currentUser.role !== "Manager") {
      console.error("Authorization Error: Only Managers can delete stories.");
      return;
    }
    const newState = admin
      ? {
          ...admin,
          projects: admin.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  userStories: p.userStories.filter((s) => s.id !== storyId),
                }
              : p,
          ),
        }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const updateUserStoryStatus = (
    projectId: number,
    storyId: number,
    newStatus: UserStoryStatus,
  ) => {
    if (!admin || !currentUser) return;

    const allowedRoles: Role[] = ["Manager", "Developer", "Tester"];
    if (!allowedRoles.includes(currentUser.role)) {
      console.error(
        "Authorization Error: You do not have permission to update status.",
      );
      return;
    }
    if (currentUser.role === "Developer" && newStatus === "Completed") {
      alert("Developers cannot move stories to Completed.");
      return;
    }
    const newState = admin
      ? {
          ...admin,
          projects: admin.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  userStories: p.userStories.map((s) =>
                    s.id === storyId ? { ...s, status: newStatus } : s,
                  ),
                }
              : p,
          ),
        }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  const addUserStoryComment = (
    projectId: number,
    storyId: number,
    text: string,
  ) => {
    if (!admin || !currentUser) {
      console.error("Authorization Error: You must be logged in to comment.");
      return;
    }
    const newComment = {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
    };
    const newState = admin
      ? {
          ...admin,
          projects: admin.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  userStories: p.userStories.map((s) =>
                    s.id === storyId
                      ? { ...s, comments: [...(s.comments || []), newComment] }
                      : s,
                  ),
                }
              : p,
          ),
        }
      : null;
    if (newState) {
      setAdmin(newState);
      updateAdminInStorage(newState);
    }
  };

  return {
    admin,
    setAdmin,
    currentUser,
    setCurrentUser,
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
  };
};

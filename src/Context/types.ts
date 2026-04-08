import type { User,Project,UserStory, UserStoryStatus, Admin } from "../Models";


export interface AppContextType {
  admin: Admin | null;
  currentUser: User | null;
  setAdmin: (admin: Admin | null) => void;
  setCurrentUser: (user: User | null) => void;
  logout: () => void
  users: User[];
  projects: Project[];
  addAdmin: (adminData: Omit<Admin, "id">) => Admin;
  addUser: (u: Omit<User, "avatarColor" | "password">, password: string) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (id: number) => void;
  addProject: (p: Project) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (id: number) => void;
  addUserStory: (projectId: number, s: UserStory) => void;
  updateUserStory: (projectId: number, updatedStory: UserStory) => void;
  deleteUserStory: (projectId: number, storyId: number) => void;
  updateUserStoryStatus: (
    projectId: number,
    storyId: number,
    newStatus: UserStoryStatus,
  ) => void;
  updateProjectStatus: (projectId: number, newStatus: string) => void;
  addUserStoryComment: (projectId: number, storyId: number, text: string) => void;
}

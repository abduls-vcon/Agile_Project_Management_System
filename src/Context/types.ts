import type { User,Project,UserStory, UserStoryStatus } from "../Models";


export interface AppContextType {
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

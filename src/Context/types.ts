import type { User,Project,UserStory, UserStoryStatus } from "../Models";


export interface AppContextType {
  users: User[];
  projects: Project[];
  addUser: (u: Omit<User, "avatarColor">) => void;
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

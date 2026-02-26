import type { UserStory, Project, UserStoryStatus } from "../Models";

export const addUserStory = (projects: Project[], setProjects: Function, projectId: string, story: UserStory) => {
  setProjects(
    projects.map((p) =>
      p.id === projectId ? { ...p, userStories: [...p.userStories, story] } : p
    )
  );
};

export const updateUserStory = (projects: Project[], setProjects: Function, projectId: string, updatedStory: UserStory) => {
  setProjects(
    projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            userStories: p.userStories.map((s) =>
              s.id === updatedStory.id ? updatedStory : s
            ),
          }
        : p
    )
  );
};

export const deleteUserStory = (projects: Project[], setProjects: Function, projectId: string, storyId: string) => {
  setProjects(
    projects.map((p) =>
      p.id === projectId
        ? { ...p, userStories: p.userStories.filter((s) => s.id !== storyId) }
        : p
    )
  );
};

export const updateUserStoryStatus = (projects: Project[], setProjects: Function, projectId: string, storyId: string, newStatus: UserStoryStatus) => {
  setProjects(
    projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            userStories: p.userStories.map((s) =>
              s.id === storyId ? { ...s, status: newStatus } : s
            ),
          }
        : p
    )
  );
};

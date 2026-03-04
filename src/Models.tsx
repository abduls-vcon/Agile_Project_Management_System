export interface User{
    id: number,
    name:string,
    role: Role,
    avatarColor?:string
}


export interface UserStory{
    id:number,
    title:string,
    description:string,
    isBug:boolean,
    status: UserStoryStatus,
    priority: Priority,
    assignedTo: number | undefined,
    createdDate?:string;
    storyPoints?:number,
}


export interface Project{
    id:number,
    name:string,
    description:string,
    status:string,
    userStories:UserStory[],
    ownerId:number,
    teamMembers:User[],
    createdDate?:string,
}

export type UserStoryStatus = "Backlog" | "In Progress" | "Testing" | "Completed";
export type Role = "Developer" | "Tester" | "Manager";
export type Priority = "Low" | "Medium" | "High";
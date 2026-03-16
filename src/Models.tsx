export interface Admin{
    id:number,
    companyName: string,
    address: {
        street:string,
        city:string,
        state:string,
        country:string
    },
    industry:string,
    users: User[],
    projects: Project[]
}



export interface User{
    id: number,
    name:string,
    email: string;
    role: Role,
    avatarColor?:string,
    password?: string; // NOTE: In a real app, this would never be stored in plaintext
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
    dueDate?:string;
    storyPoints?:number,
    comments?:Comment[]
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


export interface Comment{
    id:number,
    text:string,
    timestamp: string,
    userId: number,
}

export type UserStoryStatus = "Backlog" | "In Progress" | "Testing" | "Completed";
export type Role = "Admin" | "Manager" | "Developer" | "Tester";
export type Priority = "Low" | "Medium" | "High";
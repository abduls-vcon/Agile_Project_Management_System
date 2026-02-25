export interface User{
    id: string,
    name:string,
    role: "Developer" | "Tester" | "Manager",
    avatarColor?:string
}


export interface UserStory{
    id:string,
    title:string,
    description:string,
    status: "Backlog" | "In Progress" | "Testing" | "Completed",
    priority: "Low" | "Medium" | "High",
    assignedTo: string;
    storyPoints?:number,
}


export interface Project{
    id:string,
    name:string,
    description:string,
    status:string,
    userStories:UserStory[],
    ownerId:number,
    createdDate:string,
    updatedDate:string
}
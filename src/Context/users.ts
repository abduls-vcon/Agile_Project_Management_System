import { useState, useEffect } from "react";
import type { User, Project } from "../Models";



export const useUsers = (setProjects: React.Dispatch<React.SetStateAction<Project[]>>) => {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  

  return { users,};
};
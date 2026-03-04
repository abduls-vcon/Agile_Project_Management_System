import { useState, useEffect } from "react";
import type { User, Project } from "../Models";
import randomHexColor from "../Hooks/useRandomHexColor";

export const useUsers = (setProjects: React.Dispatch<React.SetStateAction<Project[]>>) => {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = (u: Omit<User, "avatarColor">) =>
    setUsers((prev) => [...prev, { ...u, avatarColor: randomHexColor() }]);

  const updateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        teamMembers: p.teamMembers.map((m) =>
          m.id === updatedUser.id ? updatedUser : m,
        ),
      })),
    );
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        teamMembers: p.teamMembers.filter((m) => m.id !== id),
      })),
    );
  };

  return { users, addUser, updateUser, deleteUser };
};
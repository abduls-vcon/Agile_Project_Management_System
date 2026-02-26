import { useState, useEffect } from "react";
import type { User } from "../Models";
import randomHexColor from "../Hooks/useRandomHexColor";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const addUser = (u: Omit<User, "avatarColor">) =>
    setUsers((prev) => [...prev, { ...u, avatarColor: randomHexColor() }]);

  const updateUser = (updatedUser: User) =>
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

  const deleteUser = (id: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  return { users, addUser, updateUser, deleteUser };
};
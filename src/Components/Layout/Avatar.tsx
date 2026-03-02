import React from "react";
import { Avatar as MuiAvatar } from "@mui/material";
import type { User } from "../../Models";

interface AvatarProps {
  user: User;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ user, size }) => {
  return (
    <MuiAvatar
      sx={{
        bgcolor: user.avatarColor,
        width: size,
        height: size,
        fontWeight: 600,
      }}
    >
      {user.name.charAt(0)}
    </MuiAvatar>
  );
};

export default Avatar;
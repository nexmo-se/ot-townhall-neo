// @flow
import React from "react";
import ReactAvatar from "react-avatar";
import User from "entities/user";

type AvatarProps = {
  user: User,
  size: number,
  className?: any
}

function Avatar({ user, size, className }:AvatarProps){
  return (
    <ReactAvatar 
      src={`https://ui-avatars.com/api/?name=${user.name}&bold=true&size=256&background=131415&color=ffffff`}
      size={size}
      className={className}
      round
    />
  )
}
export default Avatar;
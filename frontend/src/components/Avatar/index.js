import React, { useMemo } from "react";
import ReactAvatar from "react-avatar";
import lodash from "lodash";

function Avatar(props){
  const user = lodash(props).get("user");
  const size = lodash(props).get("size", 50);
  const className = lodash(props).get("className");
  const color = lodash(props).get("color", "ffffff");
  const backgroundColor = lodash(props).get("backgroundColor", "131415")

  const Avatar = useMemo(
    () => (
      <ReactAvatar 
        src={`https://ui-avatars.com/api/?name=${user.name}&bold=true&size=256&background=${backgroundColor}&color=${color}`}
        size={size}
        className={className}
        round
      />
    ),
    [user, size, className, color, backgroundColor]
  );

  return Avatar;
}

export default Avatar;
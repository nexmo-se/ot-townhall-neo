import { useState } from "react";
import { MenuContext } from "./contexts/menu";

function MenuProvider ({ children }) {
  const [currentMenu, setCurrentMenu] = useState("settings");

  return (
    <MenuContext.Provider
      value={{
        currentMenu,
        setCurrentMenu
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export { useMenu } from "./hooks/menu";
export default MenuProvider;
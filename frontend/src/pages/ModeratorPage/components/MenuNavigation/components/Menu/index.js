import VoltaIcon from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";

import clsx from "clsx";
import { useMenu } from "../../../MenuProvider"

function Menu ({ id, name, tooltip, badgeCount }) {
  const { currentMenu, setCurrentMenu } = useMenu();

  function handleClick () {
    setCurrentMenu(id);
  }

  return (
    <li onClick={handleClick}>
      <div
        className={
          clsx({
            "Vlt-sidemenu__link": true,
            "Vlt-sidemenu__link_active": currentMenu === id
          })
        }
      >
        <svg>
          <use xlinkHref={`${VoltaIcon}#${name}`}/>
        </svg>
        <span className="Vlt-sidemenu__label">
          {tooltip}
        </span>
        {
          (badgeCount && badgeCount !== 0) && (
            <span className="Vlt-badge Vlt-badge--small Vlt-badge--red">
              {badgeCount}
            </span>
          )
        }
      </div>
      <span className="Vlt-sidemenu__tooltip">
        {tooltip}
      </span>
    </li>
  )
}

export default Menu;

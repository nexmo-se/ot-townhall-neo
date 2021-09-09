import Menu from "./components/Menu";
import LogoHeader from "./components/LogoHeader";
import { useEffect } from "react";

function MenuNavigation () {
  useEffect(
    () => {
      window.Volta.init(["menu", "menuCollapse"])
    },
    []
  )

  return (
    <nav
      id="Vlt-sidenav"
      className="Vlt-sidenav Vlt-sidenav--collapsed Vlt-sidenav--dark"
    >
      <LogoHeader />
      <div className="Vlt-sidenav__scroll">
        <ul className="Vlt-sidemenu">
          <Menu
            id="participants"
            name="Vlt-icon-group-3-full"
            tooltip="Participants"
          />
          <Menu
            id="go-live-requests"
            name="Vlt-icon-plug-full"
            tooltip="Requests To Go Live"
            badgeCount={2}
          />
          <Menu
            id="chat"
            name="Vlt-icon-chat-2-full"
            tooltip="Chats"
          />
          <Menu
            id="questions"
            name="Vlt-icon-help-negative"
            tooltip="Questions"
          />
          <Menu
            id="polling"
            name="Vlt-icon-chart-full"
            tooltip="Polling"
          />
          <Menu
            id="settings"
            name="Vlt-icon-gear-full"
            tooltip="Settings"
          />
        </ul>
      </div>
    </nav>
  )
}

export default MenuNavigation;

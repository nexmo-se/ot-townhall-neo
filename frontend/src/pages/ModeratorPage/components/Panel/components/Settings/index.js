import { useConfiguration } from "components/ConfigurationProvider";

import Panel from "../Panel";
import Pin from "./components/Pin";
import Tabs from "./components/Tabs";

function Settings () {
  const { configuration } = useConfiguration();
  return (
    <Panel>
      <div>
        <h3>
          Settings
        </h3>
      </div>
      <Pin />
      <hr className="hr--tall Vlt-gradient--blue-to-pink" />
      <Tabs defaultConfiguration={configuration} />
    </Panel>
  );
}

export default Settings;

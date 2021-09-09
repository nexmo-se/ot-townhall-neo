import lodash from "lodash";
import Tabs from "./models/tabs";
import Login from "./models/login";
import ParticipantLogin from "./models/participant-login";

import { DEFAULT_CONFIGURATION } from "./contexts/configuration";
import { ConfigurationContext } from "./contexts/configuration";
import { ConfigurationService } from "./services/configuration";
import { useCallback, useEffect, useState } from "react";

function ConfigurationProvider ({ children, tenant }) {
  const [configuration, setConfiguration] = useState(DEFAULT_CONFIGURATION);

  const fetchConfiguration = useCallback(
    async () => {
      if (!tenant) return;

      const configuration = await ConfigurationService.retrieve({ tenant });
      setConfiguration(configuration);
    },
    [tenant]
  )

  /**
   * We need to pass every configuration from client side to the server.
   * Because the server will take everything and update the database
   * 
   * TODO: Make this more secure
   */
  const updateConfiguration = useCallback(
    async (newConfiguration) => {
      if (!configuration) return;
      if (!tenant) return;

      const clonnedConfiguration = lodash(configuration).clone();
      const mergedConfiguration = lodash(clonnedConfiguration).merge(newConfiguration).value();

      await ConfigurationService.update({
        data: mergedConfiguration,
        tenant
      });
      
      await fetchConfiguration();
    },
    [tenant, configuration, fetchConfiguration]
  )

  useEffect(
    () => {
      fetchConfiguration()
    },
    [fetchConfiguration]
  )

  return (
    <ConfigurationContext.Provider
      value={{
        configuration,
        updateConfiguration
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}

export { Tabs, Login, ParticipantLogin }
export { useConfiguration } from "./hooks/configuration";
export default ConfigurationProvider;

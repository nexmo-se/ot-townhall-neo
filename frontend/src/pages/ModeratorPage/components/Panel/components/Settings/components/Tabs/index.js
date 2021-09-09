import styles from "./Tabs.module.css";

import lodash from "lodash";
import clsx from "clsx";

import { useEffect, useState } from "react";
import { useConfiguration } from "components/ConfigurationProvider";

import Checkbox from "components/Checkbox";

function Tabs ({ defaultConfiguration }) {
  const [localConfig, setLocalConfig] = useState(defaultConfiguration.tabs);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { updateConfiguration } = useConfiguration();

  async function handleSaveClick () {
    if (isLoading) return;
    if (!hasChanges) return;

    try {
      setIsLoading(true);
      await updateConfiguration({ tabs: localConfig });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange (tabName, checked) {
    setLocalConfig(
      (prevConfig) => {
        const newConfig = { [tabName]: checked }
        const clonnedPrev = lodash(prevConfig).clone();

        const mergedConfig = lodash(clonnedPrev).merge(newConfig).value();
        return mergedConfig;
      }
    )
  }

  useEffect(
    () => {
      const isEqual = lodash(defaultConfiguration.tabs).isEqual(localConfig)
      setHasChanges(!isEqual);
    },
    [localConfig, defaultConfiguration.tabs]
  )

  return (
    <>
      <p>
        <strong>Tabs.&nbsp;</strong>
        You can setup Tabs here. This will effect all roles
      </p>
      <div className={styles.tabs}>
        <div>
          <Checkbox
            value="participatns"
            label="Participants"
            checked={localConfig.participants}
            onChange={(checked) => handleChange("participants", checked)}
            disabled={isLoading}
          />
          <Checkbox
            value="chats"
            label="Chats"
            checked={localConfig.chat}
            onChange={(checked) => handleChange("chat", checked)}
            disabled={isLoading}
          />
        </div>
        <div>
          <Checkbox
            value="questions"
            label="Questions"
            checked={localConfig.questions}
            onChange={(checked) => handleChange("questions", checked)}
            disabled={isLoading}
          />
          <Checkbox
            value="polling"
            label="Polling"
            checked={localConfig.polling}
            onChange={(checked) => handleChange("polling", checked)}
            disabled={isLoading}
          />
        </div>
      </div>
      <div
        className={
          clsx({
            "Vlt-purple-dark": hasChanges && !isLoading,
            "Vlt-grey-dark": !hasChanges || isLoading,
            [styles.save]: true,
            [styles.disabled]: !hasChanges || isLoading,
          })
        }
        onClick={handleSaveClick}
      >
        Save Tabs Setting
      </div>
    </>
  )
}

export default Tabs;
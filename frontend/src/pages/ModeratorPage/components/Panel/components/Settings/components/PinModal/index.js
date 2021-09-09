import lodash from "lodash";
import validator from "validator";

import { useConfiguration } from "components/ConfigurationProvider";
import { useEffect, useState } from "react";

import PinForm from "../PinForm";
import ParticipantPinForm from "../ParticipantPinForm";
import Button from "components/Button";
import Modal from "components/Modal";

function PinModal (props) {
  const open = lodash(props).get("open", false);
  const defaultConfiguration = lodash(props).get("defaultConfiguration");
  const onCancelClick = lodash(props).get("onCancelClick", () => {});
  const onSaved = lodash(props).get("onSaved");

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [localConfiguration, setLocalConfiguration] = useState(defaultConfiguration);
  const { updateConfiguration } = useConfiguration();

  function handleChange (role, value) {
    setLocalConfiguration(
      (prevConfig) => {
        const newConfig = { [role]: value };
        const clonnedPrev = lodash(prevConfig).clone();

        const mergedConfig = lodash(clonnedPrev).merge(newConfig).value();
        return mergedConfig;
      }
    )
  }

  async function handleSaveClick () {
    if (isLoading) return;

    try {
      setIsLoading(true);
      console.log(localConfiguration);
      await updateConfiguration({
        moderator: localConfiguration.moderator,
        presenter: localConfiguration.presenter,
        participant: localConfiguration.participant
      });
      if (onSaved) onSaved();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Detect what has been changed. If nothing has been changed, then do not allow to save
   * the configuration.
   */
  useEffect(
    () => {
      // Since we allow blank pin, we need to remove the pin if it is blank
      const removeEmptyPin = (config, role) => {
        if (lodash(config[role].pin).isNil()) return;
        config[role].pin = validator.isEmpty(config[role].pin)? undefined: config[role].pin;

        if (lodash(config[role].pin).isNil()) delete config[role].pin;
      }

      const clonnedLocal = lodash(localConfiguration).clone();
      removeEmptyPin(clonnedLocal, "participant");
      removeEmptyPin(clonnedLocal, "moderator");
      removeEmptyPin(clonnedLocal, "presenter");

      const isEqual = lodash.isEqual(defaultConfiguration, clonnedLocal);
      setHasChanges(!isEqual);
    },
    [defaultConfiguration, localConfiguration]
  )

  return (
    <Modal
      id="pin-settings-modal"
      open={open}
      large
    >
      <Modal.Header>
        <h3>PIN Settings</h3>
      </Modal.Header>
      <Modal.Content>
        <div>
          <p>
            System will set default PIN for everyone. You can make it yours by setting it up here
          </p>
          <p>
            <strong>Note:&nbsp;</strong>
            Leave it blank if you don't wish to change PIN.
          </p>
        </div>
        <div>
          <PinForm
            label="Moderator PIN"
            value={localConfiguration.moderator}
            onChange={(value) => handleChange("moderator", value)}
            disabled={isLoading}
          />
          <PinForm
            label="Presenter PIN"
            value={localConfiguration.presenter}
            onChange={(value) => handleChange("presenter", value)}
            disabled={isLoading}
          />
          <ParticipantPinForm
            label="Participant PIN"
            value={localConfiguration.participant}
            onChange={(value) => handleChange("participant", value)}
            disabled={isLoading}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <Button
          text="Cancel"
          className="Vlt-btn--tertiary"
          disabled={isLoading}
          onClick={onCancelClick}
        />
        <Button
          text="Update PIN"
          className="Vlt-btn--secondary"
          disabled={isLoading || !hasChanges}
          onClick={handleSaveClick}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default PinModal;

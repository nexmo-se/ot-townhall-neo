// @flow
import React from "react";
import ConfigurationService from "services/configuration";

import useStyles from "./styles";
import { useParams } from "react-router-dom";

import ResetSettings from "../ResetSettings";
import TextInput from "components/TextInput";
import Modal from "components/Modal";
import Checkbox from "components/Checkbox";

interface ISettingsModal {
  open: boolean;
  onClose: () => void;
}

interface IParams {
  tenant: string;
}

function SettingsModal({ open, onClose }: ISettingsModal){
  const [ presenterPin, setPresenterPin ] = React.useState<string>("");
  const [ participantPin, setParticipantPin ] = React.useState<string>("");
  const [ moderatorPin, setModeratorPin ] = React.useState<string>("");
  const [ participantsTab, setParticipantsTab ] = React.useState<boolean>(false);
  const [ chatTab, setChatTab ] = React.useState<boolean>(false);
  const [ questionsTab, setQuestionsTab ] = React.useState<boolean>(false);
  const [ pollingTab, setPollingTab ] = React.useState<boolean>(false);
  const { tenant } = useParams<IParams>();
  const mStyles = useStyles();

  async function handleSave(){
    const payload = {
      participant: participantPin? { pin: participantPin }: undefined,
      presenter: presenterPin? { pin: presenterPin }: undefined,
      moderator: moderatorPin? { pin: moderatorPin }: undefined,
      tabs: {
        questions: questionsTab,
        participants: participantsTab,
        chat: chatTab,
        polling: pollingTab
      }
    }
    const cleanPayload = JSON.parse(JSON.stringify(payload));
    await ConfigurationService.update({ tenant, data: cleanPayload });

    setParticipantPin("");
    setPresenterPin("");
    setModeratorPin("");

    if(onClose) onClose();
  }

  React.useEffect(() => {
    async function fetch(){
      const configuration = await ConfigurationService.retrieve({ tenant });
      setParticipantsTab(configuration.tabs.participants);
      setChatTab(configuration.tabs.chat);
      setQuestionsTab(configuration.tabs.questions);
      setPollingTab(configuration.tabs.polling);
    }
    fetch();
  }, [ tenant ])
  
  return (
    <Modal 
      id="settings-modal"
      open={open}
      large
    >
      <Modal.Header>
        <h4>Settings</h4>
        <Modal.Dismiss />
      </Modal.Header>
      <Modal.Content>
        <p>System will set default PIN for everyone. You can make it yours by setting it up here</p>
        <p>
          <strong>Note: </strong>
          Leave it blank if you don't wish to change PIN.
        </p>
        <TextInput 
          label="Presenter PIN"
          text={presenterPin}
          onChange={setPresenterPin}
          type="password"
          placeholder="Enter new pin here"
        />

        <TextInput 
          label="Moderator PIN"
          text={moderatorPin}
          onChange={setModeratorPin}
          type="password"
          placeholder="Enter new pin here"
        />

        <TextInput 
          label="Participant PIN"
          text={participantPin}
          onChange={setParticipantPin}
          type="password"
          placeholder="Enter new pin here"
        />

        <hr className="hr--tall Vlt-gradient--blue-to-pink"></hr>

        <p>
          <strong>Tabs.</strong> &nbsp;
          You can setup Tabs here. This will effect all roles
        </p>

        <div className={mStyles.tabs}>
          <div>
            <Checkbox 
              value="participants"
              label="Participants List"
              checked={participantsTab}
              onChange={setParticipantsTab}
            />
            <Checkbox 
              value="chats"
              label="Chats"
              checked={chatTab}
              onChange={setChatTab} 
            />
          </div>
          <div>
            <Checkbox 
              value="questions"
              label="Questions"
              checked={questionsTab}
              onChange={setQuestionsTab}
            />
            <Checkbox 
              value="polling"
              label="Polling"
              checked={pollingTab} 
              onChange={setPollingTab}
            />
          </div>
        </div>

        <hr className="hr--tall Vlt-gradient--blue-to-pink"></hr>
        <ResetSettings />
      </Modal.Content>
      <Modal.Footer>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--tertiary Vlt-modal__cancel"

        >
          Cancel
        </button>
        <button
          className="Vlt-btn Vlt-btn--app Vlt-btn--secondary"
          onClick={handleSave}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default SettingsModal;

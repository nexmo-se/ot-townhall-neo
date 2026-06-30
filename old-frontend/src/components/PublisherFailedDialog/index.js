// @flow
import React from "react";
import InfoDialog from "components/InfoDialog";

interface PublisherFailedDialogProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

function PublisherFailedDialog ({ visible, setVisible }: PublisherFailedDialogProps) {
  return (
    <InfoDialog
      id="publisher-failed"
      title="Publisher failed"
      visible={visible}
      setVisible={setVisible}
    >
      <p>
        We tried to access your camera 3 times but failed. 
        Please make sure you allow us to access your camera and no other application is using it.
        You may refresh the page to retry. 
        
        <br /><br />
        We will inform Moderator that your camera is not available.
      </p>
    </InfoDialog>
  )
}

export default PublisherFailedDialog;

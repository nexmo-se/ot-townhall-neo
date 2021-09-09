import OtherControl from "../OtherControl";
import Tooltip from "components/Tooltip";

function RecordButton () {
  return (
    <Tooltip title="Start Recording">
      <OtherControl
        iconName="Vlt-icon-rec-full"
        title="Record"
      />
    </Tooltip>
  )
}

export default RecordButton;

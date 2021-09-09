import OtherControl from "../OtherControl";
import Tooltip from "components/Tooltip";

function ShareButton () {
  
  return (
    <Tooltip title="Share">
      <OtherControl
        iconName="Vlt-icon-screen-share-full"
        title="Share"
      />
    </Tooltip>
  )
}

export default ShareButton;